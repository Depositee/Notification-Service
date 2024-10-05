import { DataSource } from 'typeorm';
import 'dotenv/config';
import { Notification } from '../entity/Notification';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'notification_system',
  entities: [Notification],
  synchronize: true,  // Be careful with synchronize in production
  logging: false,
});
