CREATE TABLE "balances" (
	"account_id" varchar PRIMARY KEY NOT NULL,
	"owner_name" varchar NOT NULL,
	"balance" numeric(18, 2) DEFAULT '0',
	"updated_at" timestamp DEFAULT now()
);
