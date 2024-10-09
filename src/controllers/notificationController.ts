import { Request, Response } from 'express';
import { NotificationService } from "../services/notificationService";

const notificationService = new NotificationService();
    
export const createNotification = async (req : Request, res : Response) => {
      try {
        const { userId,packageId, message } = req.body;
        const notification = await notificationService.createNotification(userId,packageId, message);
        res.json(notification);
      } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Failed to create notification' });
      }
};
    
    // GET route for fetching notifications by userId
export const getNotificationsByUserId =  async (req : Request, res : Response) => {
      try {
        const userId = req.params.userId;
        const notifications = await notificationService.getNotificationsByUser(userId);
        res.json(notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
      }
};
     // Update notification by notificationId
export const updateNotification =  async (req : Request, res : Response) => {
      try {
        const notificationId = parseInt(req.params.notificationId, 10);
        const updatedData = req.body;
        const updatedNotification = await notificationService.updateNotification(notificationId, updatedData);
        res.json(updatedNotification);
      } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ error: 'Failed to update notification' });
      }
};

    // Delete notification by notificationId
export const deleteNotification = async (req : Request, res : Response) => {
      try {
        const notificationId = parseInt(req.params.notificationId, 10);
        await notificationService.deleteNotification(notificationId);
        res.json({ message: 'Notification deleted successfully' });
      } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Failed to delete notification' });
      }
};