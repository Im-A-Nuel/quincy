# Profiles

## `GET /api/v1/profiles/:address`

Reputation and stats for a wallet.

### Response

```json
{
  "walletAddress": "0x...",
  "bountiesPosted": 5,
  "bountiesCompletedAsPoster": 4,
  "bountiesClaimed": 12,
  "bountiesCompletedAsHunter": 11,
  "totalEarned": "28.50",
  "totalSpent": "15.00"
}
```

### A wallet with no activity is not an error

If `:address` has never posted or claimed anything, the endpoint still returns **200** with every counter zeroed — not a 404. This matters for the frontend: [Profile](../frontend/overview.md) pages and the [wallet dropdown](../frontend/design-system.md#primitives) both call this unconditionally for whatever address is connected, and a fresh wallet shouldn't render as an error state.

### Errors

| Status | Code | When |
|---|---|---|
| 400 | `BAD_REQUEST` | `:address` doesn't match `0x` + 40 hex chars |
| 500 | `INDEXER_ERROR` | Database query failed |

## Error response shape

Every error from every `/api/v1/*` endpoint has the same envelope:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Bounty with id 999 does not exist"
  }
}
```
