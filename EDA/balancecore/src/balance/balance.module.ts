import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { DrizzleService } from '../drizzle/drizzle.service';

@Module({
  providers: [BalanceService, DrizzleService],
  exports: [BalanceService],
})
export class BalanceModule {}
