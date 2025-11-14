import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { BalanceModule } from './balance/balance.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [DrizzleModule, BalanceModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
