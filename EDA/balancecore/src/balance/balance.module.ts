import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { DrizzleService } from '../drizzle/drizzle.service';

@Module({
  // imports: [],
  providers: [BalanceService, DrizzleService],
  exports: [],
})
export class BalanceModule {}
