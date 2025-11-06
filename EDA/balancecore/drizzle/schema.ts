import { numeric, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const balances = pgTable('balances', {
  accountId: varchar('account_id').primaryKey(),
  ownerName: varchar('owner_name').notNull(),
  balance: numeric('balance', { precision: 18, scale: 2 }).default('0'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Balance = typeof balances.$inferInsert;
export type NewBalances = typeof balances.$inferInsert;
