import express from 'express';
import { NotificationService } from './services/notificationService';
import { createConnection } from './config/datasource';

const app = express();
const port = 3000; 

async function startServer() {
  try {
    await createConnection();
    console.log('Database connected successfully');
    
    app.use(express.json());
    
    const notificationService = new NotificationService();
    
    app.post('/notifications', async (req, res) => {
      try {
        const { userId,packageId, message } = req.body;
        const notification = await notificationService.createNotification(userId,packageId, message);
        res.json(notification);
      } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Failed to create notification' });
      }
    });
    
    // GET route for fetching notifications by userId
    app.get('/notifications/:userId', async (req, res) => {
      try {
        const userId = req.params.userId;
        const notifications = await notificationService.getNotificationsByUser(userId);
        res.json(notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
      }
    });
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    
  } catch (error) {
    throw new Error('Failed to connect to the database');
  }
}

startServer();
