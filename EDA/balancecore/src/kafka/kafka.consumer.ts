import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { BalanceService } from '../balance/balance.service';

interface BalanceUpdatedEvent {
  Payload: {
    account_id_from: string;
    account_id_to: string;
    balance_account_id_from: number;
    balance_account_id_to: number;
  };
}

@Injectable()
export class KafkaConsumer implements OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly logger = new Logger(KafkaConsumer.name);

  constructor(private readonly balanceService: BalanceService) {
    this.kafka = new Kafka({
      brokers: ['kafka:29092'],
    });

    this.consumer = this.kafka.consumer({
      groupId: 'wallet',
    });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'balances',
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({
        topic,

        message,
      }: EachMessagePayload) => {
        try {
          if (!message.value) {
            this.logger.warn(`Received empty message on topic ${topic}`);
            return;
          }

          const payload = JSON.parse(
            message.value.toString(),
          ) as BalanceUpdatedEvent;

          await this.balanceService.upsertBalance({
            accountIdFrom: payload.Payload.account_id_from,
            accountIdTo: payload.Payload.account_id_to,
            balanceFrom: payload.Payload.balance_account_id_from,
            balanceTo: payload.Payload.balance_account_id_to,
          });
        } catch (error) {
          this.logger.error('Failed to process message', error);
        }
      },
    });

    this.logger.log('KafkaConsumer initialized');
  }
}
