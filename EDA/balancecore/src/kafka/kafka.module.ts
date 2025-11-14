import { Module } from '@nestjs/common';
import { KafkaConsumer } from './kafka.consumer';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [BalanceModule],
  providers: [KafkaConsumer],
  exports: [KafkaConsumer],
})
export class KafkaModule {}
