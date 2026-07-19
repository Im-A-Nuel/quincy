// Map Postgres rows (snake_case) into the API's camelCase shapes.

export function mapBountyListItem(row: Record<string, unknown>) {
  return {
    id: Number(row.id),
    title: row.title as string,
    category: row.category as string,
    rewardToken: row.reward_token as string,
    rewardAmount: String(row.reward_amount),
    status: row.status as string,
    posterAddress: row.poster_address as string,
    deadline: new Date(row.deadline as string).toISOString(),
  };
}

export function mapBounty(row: Record<string, unknown>) {
  return {
    id: Number(row.id),
    posterAddress: row.poster_address as string,
    hunterAddress: (row.hunter_address as string) ?? null,
    title: row.title as string,
    description: row.description as string,
    category: row.category as string,
    rewardToken: row.reward_token as string,
    rewardAmount: String(row.reward_amount),
    status: row.status as string,
    proofUri: (row.proof_uri as string) ?? null,
    deadline: new Date(row.deadline as string).toISOString(),
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString(),
    txHashCreated: row.tx_hash_created as string,
    txHashCompleted: (row.tx_hash_completed as string) ?? null,
  };
}

export function mapReputation(row: Record<string, unknown> | undefined, address: string) {
  if (!row) {
    return {
      walletAddress: address,
      bountiesPosted: 0,
      bountiesCompletedAsPoster: 0,
      bountiesClaimed: 0,
      bountiesCompletedAsHunter: 0,
      totalEarnedCusd: "0",
      totalSpentCusd: "0",
      totalEarnedCelo: "0",
      totalSpentCelo: "0",
    };
  }
  return {
    walletAddress: row.wallet_address as string,
    bountiesPosted: Number(row.bounties_posted),
    bountiesCompletedAsPoster: Number(row.bounties_completed_as_poster),
    bountiesClaimed: Number(row.bounties_claimed),
    bountiesCompletedAsHunter: Number(row.bounties_completed_as_hunter),
    totalEarnedCusd: String(row.total_earned_cusd),
    totalSpentCusd: String(row.total_spent_cusd),
    totalEarnedCelo: String(row.total_earned_celo),
    totalSpentCelo: String(row.total_spent_celo),
  };
}
