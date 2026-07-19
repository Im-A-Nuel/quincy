-- Quincy indexed read layer (Postgres / Supabase).
-- Mirror of on-chain QuincyBounty state; the contract is the source of truth.

CREATE TABLE IF NOT EXISTS bounties (
    id                  INTEGER PRIMARY KEY,
    poster_address      VARCHAR(42) NOT NULL,
    hunter_address      VARCHAR(42),
    title               TEXT        NOT NULL,
    description         TEXT        NOT NULL,
    category            VARCHAR(32) NOT NULL,
    reward_token        VARCHAR(42) NOT NULL DEFAULT '0x765de816845861e75a25fca122bb6898b8b1282',
    reward_amount       NUMERIC(38, 18) NOT NULL,
    status              VARCHAR(16) NOT NULL,
    proof_uri           TEXT,
    deadline            TIMESTAMPTZ NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL,
    updated_at          TIMESTAMPTZ NOT NULL,
    tx_hash_created     VARCHAR(66) NOT NULL,
    tx_hash_completed   VARCHAR(66)
);

-- Multi-token migration: add reward_token to a table that predates it. The
-- default is the cUSD address, since every bounty ever created before this
-- migration was under the cUSD-only contract.
ALTER TABLE bounties ADD COLUMN IF NOT EXISTS reward_token VARCHAR(42)
    NOT NULL DEFAULT '0x765de816845861e75a25fca122bb6898b8b1282';

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
    total_earned_cusd               NUMERIC(38, 18) NOT NULL DEFAULT 0,
    total_spent_cusd                NUMERIC(38, 18) NOT NULL DEFAULT 0,
    total_earned_celo               NUMERIC(38, 18) NOT NULL DEFAULT 0,
    total_spent_celo                NUMERIC(38, 18) NOT NULL DEFAULT 0
);

-- Multi-token migration: the old columns only ever tracked cUSD (the only
-- token that existed before), so they're renamed rather than dropped to
-- preserve existing totals. Safe to run repeatedly.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'reputations' AND column_name = 'total_earned') THEN
        ALTER TABLE reputations RENAME COLUMN total_earned TO total_earned_cusd;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'reputations' AND column_name = 'total_spent') THEN
        ALTER TABLE reputations RENAME COLUMN total_spent TO total_spent_cusd;
    END IF;
END $$;

ALTER TABLE reputations ADD COLUMN IF NOT EXISTS total_earned_cusd NUMERIC(38, 18) NOT NULL DEFAULT 0;
ALTER TABLE reputations ADD COLUMN IF NOT EXISTS total_spent_cusd NUMERIC(38, 18) NOT NULL DEFAULT 0;
ALTER TABLE reputations ADD COLUMN IF NOT EXISTS total_earned_celo NUMERIC(38, 18) NOT NULL DEFAULT 0;
ALTER TABLE reputations ADD COLUMN IF NOT EXISTS total_spent_celo NUMERIC(38, 18) NOT NULL DEFAULT 0;

-- Single-row checkpoint of the last block the indexer has processed.
CREATE TABLE IF NOT EXISTS indexer_state (
    id                  BOOLEAN PRIMARY KEY DEFAULT TRUE,
    last_block          BIGINT NOT NULL,
    CONSTRAINT single_row CHECK (id)
);
