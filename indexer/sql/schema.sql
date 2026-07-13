-- Quincy indexed read layer (Postgres / Supabase).
-- Mirror of on-chain QuincyBounty state; the contract is the source of truth.

CREATE TABLE IF NOT EXISTS bounties (
    id                  INTEGER PRIMARY KEY,
    poster_address      VARCHAR(42) NOT NULL,
    hunter_address      VARCHAR(42),
    title               TEXT        NOT NULL,
    description         TEXT        NOT NULL,
    category            VARCHAR(32) NOT NULL,
    reward_amount       NUMERIC(38, 18) NOT NULL,
    status              VARCHAR(16) NOT NULL,
    proof_uri           TEXT,
    deadline            TIMESTAMPTZ NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL,
    updated_at          TIMESTAMPTZ NOT NULL,
    tx_hash_created     VARCHAR(66) NOT NULL,
    tx_hash_completed   VARCHAR(66)
);

CREATE INDEX IF NOT EXISTS idx_bounties_status ON bounties (status);
CREATE INDEX IF NOT EXISTS idx_bounties_category ON bounties (category);
CREATE INDEX IF NOT EXISTS idx_bounties_poster ON bounties (poster_address);
CREATE INDEX IF NOT EXISTS idx_bounties_hunter ON bounties (hunter_address);

CREATE TABLE IF NOT EXISTS reputations (
    wallet_address                  VARCHAR(42) PRIMARY KEY,
    bounties_posted                 INTEGER NOT NULL DEFAULT 0,
    bounties_completed_as_poster    INTEGER NOT NULL DEFAULT 0,
    bounties_claimed                INTEGER NOT NULL DEFAULT 0,
    bounties_completed_as_hunter    INTEGER NOT NULL DEFAULT 0,
    total_earned                    NUMERIC(38, 18) NOT NULL DEFAULT 0,
    total_spent                     NUMERIC(38, 18) NOT NULL DEFAULT 0
);

-- Single-row checkpoint of the last block the indexer has processed.
CREATE TABLE IF NOT EXISTS indexer_state (
    id                  BOOLEAN PRIMARY KEY DEFAULT TRUE,
    last_block          BIGINT NOT NULL,
    CONSTRAINT single_row CHECK (id)
);
