CREATE TABLE IF NOT EXISTS transactions (
  id varchar(255) NOT NULL,
  account_from_id varchar(255) NOT NULL,
  account_to_id varchar(255) NOT NULL,
  amount float NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);