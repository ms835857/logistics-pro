import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

export const PG_CONNECTION = 'PG_CONNECTION';

const pgProvider = {
  provide: PG_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const pool = new Pool({
      host: configService.get<string>('PG_HOST'),
      port: configService.get<number>('PG_PORT'),
      database: configService.get<string>('PG_DATABASE'),
      user: configService.get<string>('PG_USER'),
      password: configService.get<string>('PG_PASSWORD'),
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
      process.exit(-1);
    });

    return pool;
  },
};

@Global()
@Module({
  providers: [pgProvider],
  exports: [pgProvider],
})
export class DatabaseModule {}
