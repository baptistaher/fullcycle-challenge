import { Controller, Get, Param } from '@nestjs/common';
import { BalanceService } from './balance.service';
@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(':balanceId')
  async getBalance(@Param('balanceId') balanceId: string) {
    return await this.balanceService.getBalance(balanceId);
  }
}
