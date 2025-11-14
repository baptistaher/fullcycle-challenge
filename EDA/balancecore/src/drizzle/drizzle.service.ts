import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  logger = new Logger(DrizzleService.name);

  private pool: Pool;
  public db: ReturnType<typeof drizzle>;
  constructor() {
    this.pool = new Pool({
      host: 'postgres',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: 'postgres',
    });

    this.db = drizzle(this.pool, { schema });
  }

  async onModuleInit() {
    this.logger.log('DrizzleService initialized');
    await this.pool.connect();
    this.logger.log('Connected to the database');
  }

  async onModuleDestroy() {
    this.logger.log('DrizzleService is being destroyed');
    await this.pool.end();
    this.logger.log('Database connection closed');
  }
}
