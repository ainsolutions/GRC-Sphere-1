-- Extend asset_bia with financial fields
ALTER TABLE asset_bia
  ADD COLUMN IF NOT EXISTS daily_revenue numeric(14,2),
  ADD COLUMN IF NOT EXISTS hourly_loss numeric(14,2),
  ADD COLUMN IF NOT EXISTS aggregate_financial_loss numeric(14,2);


