import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'doktorgo',
  password: process.env.DB_PASSWORD || 'doktorgo',
  database: process.env.DB_NAME || 'doktorgo',
  entities: [__dirname + '/../database/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});