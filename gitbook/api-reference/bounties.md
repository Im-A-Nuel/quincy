# Bounties

Read-only. Backed directly by the indexer's Postgres tables — see [Indexer Overview](../indexer/overview.md). All writes bypass this API entirely and go straight to the contract.

## `GET /api/v1/bounties`

List bounties with optional filters, sorting, and pagination.

### Query parameters

| Param | Type | Description |
|---|---|---|
| `status` | string | Exact match on status (`open`, `in_progress`, `pending_review`, `completed`, `cancelled`, `disputed`) |
| `category` | string | Exact match on category |
| `involves` | address | Bounties where this wallet is poster **or** hunter (case-insensitive) |
| `q` | string | Case-insensitive substring match on title |
| `sort` | `newest` \| `reward_desc` | Default `newest` |
| `page` | integer | 1-indexed, 20 per page |

### Response

```json
{
  "bounties": [
    {
      "id": 12,
      "title": "Translate flyer EN → SW",
      "category": "translation",
      "rewardAmount": "2.50",
      "status": "open",
      "posterAddress": "0x...",
      "deadline": "2026-07-20T00:00:00.000Z"
    }
  ],
  "page": 1,
  "total": 48
}
```

### Errors

| Status | Code | When |
|---|---|---|
| 500 | `INDEXER_ERROR` | Database query failed |

## `GET /api/v1/bounties/:id`

Full detail for a single bounty.

### Response

```json
{
  "id": 12,
  "posterAddress": "0x...",
  "hunterAddress": "0x...",
  "title": "Translate flyer EN → SW",
  "description": "...",
  "category": "translation",
  "rewardAmount": "2.50",
  "status": "open",
  "proofUri": null,
  "deadline": "2026-07-20T00:00:00.000Z",
  "createdAt": "2026-07-13T00:00:00.000Z",
  "updatedAt": "2026-07-13T00:00:00.000Z",
  "txHashCreated": "0x...",
  "txHashCompleted": null
}
```

### Errors

| Status | Code | When |
|---|---|---|
| 400 | `BAD_REQUEST` | `:id` isn't a positive integer |
| 404 | `NOT_FOUND` | No bounty with that id |
| 500 | `INDEXER_ERROR` | Database query failed |
