import pg from "pg";
import { env } from "./env.js";

export const pool = new pg.Pool({ connectionString: env.databaseUrl });

/** Read the last processed block, or null if the indexer has never run. */
export async function getCheckpoint(): Promise<bigint | null> {
  const { rows } = await pool.query("SELECT last_block FROM indexer_state WHERE id = TRUE");
  return rows.length ? BigInt(rows[0].last_block) : null;
}

/** Persist the last processed block. */
export async function setCheckpoint(block: bigint): Promise<void> {
  await pool.query(
    `INSERT INTO indexer_state (id, last_block) VALUES (TRUE, $1)
     ON CONFLICT (id) DO UPDATE SET last_block = EXCLUDED.last_block`,
    [block.toString()],
  );
}

export interface BountyRow {
  id: number;
  posterAddress: string;
  hunterAddress: string | null;
  title: string;
  description: string;
  category: string;
  rewardToken: string;
  rewardAmount: string;
  status: string;
  proofUri: string | null;
  deadline: Date;
  createdAt: Date;
  txHashCreated: string;
  txHashCompleted: string | null;
}

/** Insert or update a bounty row. `created_at` / `tx_hash_created` are only set
 *  on first insert; later updates preserve them. */
export async function upsertBounty(b: BountyRow): Promise<void> {
  await pool.query(
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
      b.id,
      b.posterAddress,
      b.hunterAddress,
      b.title,
      b.description,
      b.category,
      b.rewardToken,
      b.rewardAmount,
      b.status,
      b.proofUri,
      b.deadline,
      b.createdAt,
      b.txHashCreated,
      b.txHashCompleted,
    ],
  );
}

export interface ReputationRow {
  walletAddress: string;
  bountiesPosted: number;
  bountiesCompletedAsPoster: number;
  bountiesClaimed: number;
  bountiesCompletedAsHunter: number;
  totalEarnedCusd: string;
  totalSpentCusd: string;
  totalEarnedCelo: string;
  totalSpentCelo: string;
}

export async function upsertReputation(r: ReputationRow): Promise<void> {
  await pool.query(
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
      r.walletAddress,
      r.bountiesPosted,
      r.bountiesCompletedAsPoster,
      r.bountiesClaimed,
      r.bountiesCompletedAsHunter,
      r.totalEarnedCusd,
      r.totalSpentCusd,
      r.totalEarnedCelo,
      r.totalSpentCelo,
    ],
  );
}
