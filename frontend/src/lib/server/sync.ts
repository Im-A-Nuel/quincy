import { createPublicClient, http, formatUnits, getContract } from "viem";
import { celo } from "viem/chains";
import { getPool } from "./db";
import { quincyAbi } from "./quincyAbi";
import { decodeMetadata } from "@/lib/metadata";
import { quincyAddress } from "@/lib/chains";

// Both reward tokens (cUSD and CELO) use 18 decimals on Celo.
const TOKEN_DECIMALS = 18;

// Stay a few blocks behind the head: a lagging RPC node will reject getLogs
// for a block it hasn't seen yet ("block is out of range").
const CONFIRMATIONS = 5n;

// Cap blocks processed per invocation so a big catch-up gap can't blow past
// the serverless function's execution time limit. A stale checkpoint just
// catches up incrementally over a few cron ticks instead of one giant call.
const MAX_BLOCK_RANGE = 3000n;

const STATUS_BY_INDEX = [
  "open",
  "in_progress",
  "pending_review",
  "completed",
  "cancelled",
  "disputed",
];

function statusFromIndex(index: number): string {
  return STATUS_BY_INDEX[index] ?? "open";
}

function client() {
  const rpc = process.env.CELO_RPC_URL ?? "https://forno.celo.org";
  const publicClient = createPublicClient({ chain: celo, transport: http(rpc) });
  const quincy = getContract({ address: quincyAddress, abi: quincyAbi, client: publicClient });
  return { publicClient, quincy };
}

async function getCheckpoint(): Promise<bigint | null> {
  const { rows } = await getPool().query("SELECT last_block FROM indexer_state WHERE id = TRUE");
  return rows.length ? BigInt(rows[0].last_block) : null;
}

async function setCheckpoint(block: bigint): Promise<void> {
  await getPool().query(
    `INSERT INTO indexer_state (id, last_block) VALUES (TRUE, $1)
     ON CONFLICT (id) DO UPDATE SET last_block = EXCLUDED.last_block`,
    [block.toString()],
  );
}

async function syncBounty(
  quincy: ReturnType<typeof client>["quincy"],
  id: bigint,
  meta: { txCreated?: string; txCompleted?: string; createdAt?: Date },
): Promise<void> {
  const b = await quincy.read.getBounty([id]);
  const decoded = decodeMetadata(b.description);

  await getPool().query(
    `INSERT INTO bounties (
        id, poster_address, hunter_address, title, description, category,
        reward_token, reward_amount, status, proof_uri, deadline, created_at,
        updated_at, tx_hash_created, tx_hash_completed
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, NOW(), $13,$14)
     ON CONFLICT (id) DO UPDATE SET
        hunter_address = EXCLUDED.hunter_address,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        reward_token = EXCLUDED.reward_token,
        reward_amount = EXCLUDED.reward_amount,
        status = EXCLUDED.status,
        proof_uri = EXCLUDED.proof_uri,
        deadline = EXCLUDED.deadline,
        updated_at = NOW(),
        tx_hash_completed = COALESCE(EXCLUDED.tx_hash_completed, bounties.tx_hash_completed)`,
    [
      Number(id),
      b.poster.toLowerCase(),
      b.hunter === "0x0000000000000000000000000000000000000000" ? null : b.hunter.toLowerCase(),
      decoded.title,
      decoded.description,
      decoded.category,
      b.token.toLowerCase(),
      formatUnits(b.reward, TOKEN_DECIMALS),
      statusFromIndex(b.status),
      b.proofURI || null,
      new Date(Number(b.deadline) * 1000),
      meta.createdAt ?? new Date(),
      meta.txCreated ?? "",
      meta.txCompleted ?? null,
    ],
  );
}

async function syncReputation(
  quincy: ReturnType<typeof client>["quincy"],
  address: string,
): Promise<void> {
  const r = await quincy.read.getReputation([address as `0x${string}`]);
  await getPool().query(
    `INSERT INTO reputations (
        wallet_address, bounties_posted, bounties_completed_as_poster,
        bounties_claimed, bounties_completed_as_hunter,
        total_earned_cusd, total_spent_cusd, total_earned_celo, total_spent_celo
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (wallet_address) DO UPDATE SET
        bounties_posted = EXCLUDED.bounties_posted,
        bounties_completed_as_poster = EXCLUDED.bounties_completed_as_poster,
        bounties_claimed = EXCLUDED.bounties_claimed,
        bounties_completed_as_hunter = EXCLUDED.bounties_completed_as_hunter,
        total_earned_cusd = EXCLUDED.total_earned_cusd,
        total_spent_cusd = EXCLUDED.total_spent_cusd,
        total_earned_celo = EXCLUDED.total_earned_celo,
        total_spent_celo = EXCLUDED.total_spent_celo`,
    [
      address.toLowerCase(),
      Number(r.bountiesPosted),
      Number(r.bountiesCompletedAsPoster),
      Number(r.bountiesClaimed),
      Number(r.bountiesCompletedAsHunter),
      formatUnits(r.totalEarnedCUSD, TOKEN_DECIMALS),
      formatUnits(r.totalSpentCUSD, TOKEN_DECIMALS),
      formatUnits(r.totalEarnedCELO, TOKEN_DECIMALS),
      formatUnits(r.totalSpentCELO, TOKEN_DECIMALS),
    ],
  );
}

export interface SyncResult {
  fromBlock: string;
  toBlock: string;
  logsProcessed: number;
  bountiesTouched: number;
  walletsTouched: number;
  caughtUp: boolean;
}

/** One-shot sync: process a bounded range of new blocks since the last
 *  checkpoint, then return. Designed to be called repeatedly by a cron
 *  trigger rather than run as a long-lived poll loop. */
export async function syncOnce(): Promise<SyncResult> {
  const { publicClient, quincy } = client();

  const rawHead = await publicClient.getBlockNumber();
  const head = rawHead > CONFIRMATIONS ? rawHead - CONFIRMATIONS : 0n;
  const checkpoint = (await getCheckpoint()) ?? head;

  if (checkpoint >= head) {
    return {
      fromBlock: checkpoint.toString(),
      toBlock: head.toString(),
      logsProcessed: 0,
      bountiesTouched: 0,
      walletsTouched: 0,
      caughtUp: true,
    };
  }

  const fromBlock = checkpoint + 1n;
  const toBlock = fromBlock + MAX_BLOCK_RANGE > head ? head : fromBlock + MAX_BLOCK_RANGE;

  const logs = await publicClient.getContractEvents({
    address: quincyAddress,
    abi: quincyAbi,
    fromBlock,
    toBlock,
  });

  const bounties = new Map<bigint, { txCreated?: string; txCompleted?: string; createdAt?: Date }>();
  const wallets = new Set<string>();
  const blockTimes = new Map<bigint, Date>();

  const touch = (id: bigint) => {
    let t = bounties.get(id);
    if (!t) {
      t = {};
      bounties.set(id, t);
    }
    return t;
  };

  for (const log of logs) {
    const args = log.args as Record<string, unknown>;
    const id = args.bountyId as bigint;
    const t = touch(id);

    switch (log.eventName) {
      case "BountyCreated": {
        t.txCreated = log.transactionHash ?? "";
        if (!blockTimes.has(log.blockNumber!)) {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber! });
          blockTimes.set(log.blockNumber!, new Date(Number(block.timestamp) * 1000));
        }
        t.createdAt = blockTimes.get(log.blockNumber!);
        wallets.add((args.poster as string).toLowerCase());
        break;
      }
      case "BountyClaimed":
        wallets.add((args.hunter as string).toLowerCase());
        break;
      case "BountyApproved":
        t.txCompleted = log.transactionHash ?? undefined;
        wallets.add((args.hunter as string).toLowerCase());
        break;
      case "DisputeResolved":
        if (args.paidHunter === true) t.txCompleted = log.transactionHash ?? undefined;
        break;
      default:
        break;
    }
  }

  for (const [id, meta] of bounties) {
    await syncBounty(quincy, id, meta);
  }
  for (const wallet of wallets) {
    await syncReputation(quincy, wallet);
  }

  await setCheckpoint(toBlock);

  return {
    fromBlock: fromBlock.toString(),
    toBlock: toBlock.toString(),
    logsProcessed: logs.length,
    bountiesTouched: bounties.size,
    walletsTouched: wallets.size,
    caughtUp: toBlock >= head,
  };
}

