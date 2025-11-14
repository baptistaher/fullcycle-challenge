import { Logger, OnModuleInit } from '@nestjs/common';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { BalanceService } from '../balance/balance.service';

interface BalanceUpdatedEvent {
  accountId: string;
  ownerName: string;
  balance: string;
  updatedAt: Date;
}

export class KafkaConsumer implements OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly logger = new Logger(KafkaConsumer.name);

  constructor(private readonly balanceService: BalanceService) {
    this.kafka = new Kafka({
      brokers: ['kafka:9092'],
    });

    this.consumer = this.kafka.consumer({ groupId: 'balances-update' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'BalanceUpdated',
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
          this.logger.log(`Received message: ${JSON.stringify(payload)}`);

          await this.balanceService.upsertBalance(payload);
        } catch (error) {
          this.logger.error('Failed to process message', error);
        }
      },
    });

    this.logger.log('KafkaConsumer initialized');
  }
}
