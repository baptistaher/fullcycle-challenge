import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { balances, NewBalances } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
@Injectable()
export class BalanceService {
  constructor(private readonly drizzle: DrizzleService) {}

  async getBalance(accountId: string) {
    const result = await this.drizzle.db
      .select()
      .from(balances)
      .where(eq(balances.accountId, accountId));

    return result || null;
  }

  async upsertBalance(data: NewBalances) {
    await this.drizzle.db
      .insert(balances)
      .values(data)
      .onConflictDoUpdate({
        target: balances.accountId,
        set: {
          ownerName: data.ownerName,
          balance: data.balance,
          updatedAt: new Date(),
        },
      });
  }
}
