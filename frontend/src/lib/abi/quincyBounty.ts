// ABI for QuincyBounty.sol. Kept in sync with the contract interface in
// docs/SCHEMA.md. Writes go frontend -> contract directly via wagmi.
export const quincyBountyAbi = [
  // --- writes ---
  {
    type: "function",
    name: "createBounty",
    stateMutability: "nonpayable",
    inputs: [
      { name: "description", type: "string" },
      { name: "reward", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
    outputs: [{ name: "bountyId", type: "uint256" }],
  },
  {
    type: "function",
    name: "claimBounty",
    stateMutability: "nonpayable",
    inputs: [{ name: "bountyId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "submitProof",
    stateMutability: "nonpayable",
    inputs: [
      { name: "bountyId", type: "uint256" },
      { name: "proofURI", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "approveBounty",
    stateMutability: "nonpayable",
    inputs: [{ name: "bountyId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "cancelBounty",
    stateMutability: "nonpayable",
    inputs: [{ name: "bountyId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "disputeBounty",
    stateMutability: "nonpayable",
    inputs: [{ name: "bountyId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "resolveDispute",
    stateMutability: "nonpayable",
    inputs: [
      { name: "bountyId", type: "uint256" },
      { name: "payHunter", type: "bool" },
    ],
    outputs: [],
  },
  // --- events ---
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
