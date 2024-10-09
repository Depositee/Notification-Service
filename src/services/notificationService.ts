import { AppDataSource } from '../config/datasource';
import { Notification } from '../entity/Notification';
import { sendMessageToQueue } from '../messegeQueue/producer';

export class NotificationService {
  private notificationRepository = AppDataSource.getRepository(Notification);

  // Create and save a new notification
  async createNotification(userId: string, packageId: string, message: string) {
    const notification = new Notification();
    notification.userId = userId;
    notification.packageId = packageId;
    notification.message = message;
    notification.isRead = false;
    notification.status = "init";

    // Save the notification
    const savedNotification = await this.notificationRepository.save(notification);

    // Send message to RabbitMQ
    await sendMessageToQueue({
      userId,
      packageId,
      message,
      notificationId: savedNotification.id, 
    });

    return savedNotification;
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

  async updateStatus(notificationId: number, status: string) {
    const notification = await this.notificationRepository.findOneBy({ id: notificationId });
    if (notification) {
      notification.status = status;
      await this.notificationRepository.save(notification);
    }
  }
  async updateNotification(notificationId: number, updatedData: Partial<Notification>) {
    const notification = await this.notificationRepository.findOneBy({ id: notificationId });
    if (notification) {
      Object.assign(notification, updatedData);  // Update fields with the new data
      return await this.notificationRepository.save(notification);
    } else {
      throw new Error('Notification not found');
    }
  }
  async deleteNotification(notificationId: number) {
    const notification = await this.notificationRepository.findOneBy({ id: notificationId });
    if (notification) {
      return await this.notificationRepository.remove(notification);
    } else {
      throw new Error('Notification not found');
    }
  }
}
