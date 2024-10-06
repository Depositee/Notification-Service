
import { AppDataSource } from '../config/datasource';
import { Notification } from '../entity/Notification';

export class NotificationService {
  private notificationRepository = AppDataSource.getRepository(Notification);

  // Create and save a new notification
  async createNotification(userId: string, message: string) {
    const notification = new Notification();
    notification.userId = userId;
    notification.message = message;
    notification.isRead = false;

    return await this.notificationRepository.save(notification);
  }

  // Get all notifications for a user
  async getNotificationsByUser(userId: string) {
    return await this.notificationRepository.find({ where: { userId } });
  }

  // Mark notification as read
  async markAsRead(notificationId: number) {
    const notification = await this.notificationRepository.findOneBy({ id: notificationId });
    if (notification) {
      notification.isRead = true;
      await this.notificationRepository.save(notification);
    }
  }
}
