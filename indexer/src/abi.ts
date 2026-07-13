// The slice of QuincyBounty the indexer needs: the seven events (as poll
// triggers) plus the two view getters it calls to rebuild each row.
export const quincyAbi = [
  {
    type: "function",
    name: "getBounty",
    stateMutability: "view",
    inputs: [{ name: "bountyId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "poster", type: "address" },
          { name: "hunter", type: "address" },
          { name: "reward", type: "uint256" },
          { name: "deadline", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "description", type: "string" },
          { name: "proofURI", type: "string" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getReputation",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "bountiesPosted", type: "uint64" },
          { name: "bountiesCompletedAsPoster", type: "uint64" },
          { name: "bountiesClaimed", type: "uint64" },
          { name: "bountiesCompletedAsHunter", type: "uint64" },
          { name: "totalEarned", type: "uint256" },
          { name: "totalSpent", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "event",
    name: "BountyCreated",
    inputs: [
      { name: "bountyId", type: "uint256", indexed: true },
      { name: "poster", type: "address", indexed: true },
      { name: "reward", type: "uint256", indexed: false },
      { name: "deadline", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BountyClaimed",
    inputs: [
      { name: "bountyId", type: "uint256", indexed: true },
      { name: "hunter", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "ProofSubmitted",
    inputs: [
      { name: "bountyId", type: "uint256", indexed: true },
      { name: "proofURI", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BountyApproved",
    inputs: [
      { name: "bountyId", type: "uint256", indexed: true },
      { name: "hunter", type: "address", indexed: true },
      { name: "reward", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BountyCancelled",
    inputs: [{ name: "bountyId", type: "uint256", indexed: true }],
  },
  {
    type: "event",
    name: "BountyDisputed",
    inputs: [{ name: "bountyId", type: "uint256", indexed: true }],
  },
  {
    type: "event",
    name: "DisputeResolved",
    inputs: [
      { name: "bountyId", type: "uint256", indexed: true },
      { name: "paidHunter", type: "bool", indexed: false },
    ],
  },
] as const;
