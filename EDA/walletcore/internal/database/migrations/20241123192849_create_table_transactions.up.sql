CREATE TABLE IF NOT EXISTS transactions (
  id varchar(255) NOT NULL PRIMARY KEY,
  account_from_id varchar(255) NOT NULL,
  account_to_id varchar(255) NOT NULL,
  amount FLOAT NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);