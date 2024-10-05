import { AppDataSource } from "./config/datasource";

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected!');
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });
