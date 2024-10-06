import { Notification } from "../entity/Notification";

export default {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_DATABASE ,
  entities: [Notification], // Path to your entities
  synchronize: true, // Set to true for auto schema sync (not recommended in production)
  logging: true, 
};
