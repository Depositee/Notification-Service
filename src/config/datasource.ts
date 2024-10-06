import { DataSource } from 'typeorm';
import 'dotenv/config';
import { Notification } from '../entity/Notification';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_DATABASE ,
  entities: [Notification],
  synchronize: true,  // Be careful with synchronize in production
  logging: false,
});

export const createConnection = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected!');
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    throw new Error('Failed to connect to the database');
  }
};

