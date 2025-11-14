import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { balances } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

interface BalanceUpdatedEvent {
  accountIdFrom: string;
  accountIdTo: string;
  balanceFrom: number;
  balanceTo: number;
}

@Injectable()
export class BalanceService {
  logger = new Logger(BalanceService.name);
  constructor(private readonly drizzle: DrizzleService) {}

  async getBalance(accountId: string) {
    this.logger.debug(`Getting balance for account ${accountId}`);
    const result = await this.drizzle.db
      .select()
      .from(balances)
      .where(eq(balances.accountId, accountId));

    this.logger.debug(
      `Balance for account ${accountId} is ${JSON.stringify(result)}`,
    );

    return result || null;
  }

  async upsertBalance(data: BalanceUpdatedEvent) {
    // Upsert from account_id_from
    await this.drizzle.db
      .insert(balances)
      .values({
        accountId: data.accountIdTo,
        balance: data.balanceTo.toString(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: balances.accountId,
        set: {
          balance: data.balanceTo.toString(),
          updatedAt: new Date(),
          // updatedAt: new Date(),
        },
      });

    await this.drizzle.db
      .insert(balances)
      .values({
        accountId: data.accountIdFrom,
        balance: data.balanceFrom.toString(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: balances.accountId,
        set: {
          balance: data.balanceFrom.toString(),
          updatedAt: new Date(),
          // updatedAt: new Date(),
        },
      });
  }
}
