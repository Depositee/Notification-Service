import express from 'express';
import { createConnection } from './config/datasource';
import NotificationRoute from "./routes/notificationRoute"

const app = express();
const port = 3001; 

async function startServer() {
  try {
    await createConnection();
    console.log('Database connected successfully');
    
    app.use(express.json());
    
    app.use('/api/v1',NotificationRoute);
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    
  } catch (error) {
    throw new Error('Failed to connect to the database');
  }
}

startServer();
