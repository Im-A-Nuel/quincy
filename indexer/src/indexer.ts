import { formatUnits } from "viem";
import { publicClient, quincy } from "./client.js";
import { quincyAbi } from "./abi.js";
import { env } from "./env.js";
import { decodeMetadata, statusFromIndex } from "./metadata.js";
import {
  getCheckpoint,
  setCheckpoint,
  upsertBounty,
  upsertReputation,
} from "./db.js";

// Both reward tokens (cUSD and CELO) use 18 decimals on Celo.
const TOKEN_DECIMALS = 18;

interface Touched {
  txCreated?: string;
  txCompleted?: string;
  createdAt?: Date;
}

/** Rebuild a single bounty row from a direct contract read. */
async function syncBounty(id: bigint, meta: Touched): Promise<void> {
  const b = await quincy.read.getBounty([id]);
  const decoded = decodeMetadata(b.description);

  await upsertBounty({
    id: Number(id),
    posterAddress: b.poster.toLowerCase(),
    hunterAddress:
      b.hunter === "0x0000000000000000000000000000000000000000"
        ? null
        : b.hunter.toLowerCase(),
    title: decoded.title,
    description: decoded.description,
    category: decoded.category,
    rewardToken: b.token.toLowerCase(),
    rewardAmount: formatUnits(b.reward, TOKEN_DECIMALS),
    status: statusFromIndex(b.status),
    proofUri: b.proofURI || null,
    deadline: new Date(Number(b.deadline) * 1000),
    createdAt: meta.createdAt ?? new Date(),
    txHashCreated: meta.txCreated ?? "",
    txHashCompleted: meta.txCompleted ?? null,
  });
}

/** Rebuild a wallet's reputation row from a direct contract read. */
async function syncReputation(address: string): Promise<void> {
  const r = await quincy.read.getReputation([address as `0x${string}`]);
  await upsertReputation({
    walletAddress: address.toLowerCase(),
    bountiesPosted: Number(r.bountiesPosted),
    bountiesCompletedAsPoster: Number(r.bountiesCompletedAsPoster),
    bountiesClaimed: Number(r.bountiesClaimed),
    bountiesCompletedAsHunter: Number(r.bountiesCompletedAsHunter),
    totalEarnedCusd: formatUnits(r.totalEarnedCUSD, TOKEN_DECIMALS),
    totalSpentCusd: formatUnits(r.totalSpentCUSD, TOKEN_DECIMALS),
    totalEarnedCelo: formatUnits(r.totalEarnedCELO, TOKEN_DECIMALS),
    totalSpentCelo: formatUnits(r.totalSpentCELO, TOKEN_DECIMALS),
  });
}

/** Process one block range: gather affected bounties/wallets from logs, then
 *  rebuild each from the contract. */
export async function processRange(fromBlock: bigint, toBlock: bigint): Promise<void> {
  const logs = await publicClient.getContractEvents({
    address: env.quincyAddress,
    abi: quincyAbi,
    fromBlock,
    toBlock,
  });
  if (logs.length === 0) return;

  const bounties = new Map<bigint, Touched>();
  const wallets = new Set<string>();
  const blockTimes = new Map<bigint, Date>();

  const touch = (id: bigint): Touched => {
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
    await syncBounty(id, meta);
  }
  for (const wallet of wallets) {
    await syncReputation(wallet);
  }

  console.log(
    `[${fromBlock}-${toBlock}] ${logs.length} logs, ${bounties.size} bounties, ${wallets.size} wallets`,
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Stay a few blocks behind the head: forno is load-balanced and a lagging node
// will reject getLogs for a block it hasn't seen yet ("block is out of range").
const CONFIRMATIONS = 5n;

/** Main loop: catch up from the checkpoint, then poll the chain head. Errors on
 *  a single range are logged and retried on the next poll rather than crashing. */
export async function run(): Promise<void> {
  let cursor = (await getCheckpoint()) ?? env.startBlock;
  console.log(`Indexer starting from block ${cursor}`);

  for (;;) {
    try {
      const rawHead = await publicClient.getBlockNumber();
      const head = rawHead > CONFIRMATIONS ? rawHead - CONFIRMATIONS : 0n;
      while (cursor < head) {
        const to = cursor + env.blockRange > head ? head : cursor + env.blockRange;
        await processRange(cursor + 1n, to);
        cursor = to;
        await setCheckpoint(cursor);
      }
    } catch (err) {
      console.error(`Poll error (cursor ${cursor}), retrying:`, (err as Error).message);
    }
    await sleep(env.pollIntervalMs);
  }
}
