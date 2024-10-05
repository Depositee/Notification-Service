export default {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'your_username', // your postgres username
  password: process.env.DB_PASSWORD || 'your_password', // your postgres password
  database: process.env.DB_DATABASE || 'notification_order', // your database name
  entities: [__dirname + '/src/entity/**/*.ts'], // Path to your entities
  synchronize: true, // Set to true for auto schema sync (not recommended in production)
  logging: true, // Enables query logging for debugging
};
