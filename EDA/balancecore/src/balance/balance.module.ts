import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { DrizzleService } from '../drizzle/drizzle.service';
import { BalanceController } from './balance.controller';

@Module({
  providers: [BalanceService, DrizzleService],
  controllers: [BalanceController],
  exports: [BalanceService],
})
export class BalanceModule {}
