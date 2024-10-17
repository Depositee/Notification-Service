import { NotificationService } from '../notificationService';
import { Notification } from '../../entity/Notification';
import { AppDataSource } from '../../config/datasource';
import { sendMessageToQueue } from '../../messegeQueue/producer';

jest.mock('../../config/datasource', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock('../../messegeQueue/producer', () => ({
  sendMessageToQueue: jest.fn(),
}));

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let mockNotificationRepo: any;

  beforeEach(() => {
    mockNotificationRepo = {
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove : jest.fn()
    };
    
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockNotificationRepo);
    notificationService = new NotificationService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and save a new notification and send a message to RabbitMQ', async () => {
    const userId = '123';
    const packageId = '456';
    const message = 'Test notification';

    const mockNotification = new Notification();
    mockNotification.id = 1;
    mockNotification.userId = userId;
    mockNotification.packageId = packageId;
    mockNotification.message = message;

    mockNotificationRepo.save.mockResolvedValue(mockNotification);

    const result = await notificationService.createNotification(userId, packageId, message);

    expect(mockNotificationRepo.save).toHaveBeenCalledWith(expect.any(Notification));
    expect(sendMessageToQueue).toHaveBeenCalledWith(
      { userId, packageId, message, notificationId: mockNotification.id },
      parseInt(userId)
    );
    expect(result).toEqual(mockNotification);
  });

  it('should fetch notifications by userId', async () => {
    const userId = '123';
    const mockNotifications = [new Notification(), new Notification()];

    mockNotificationRepo.find.mockResolvedValue(mockNotifications);

    const result = await notificationService.getNotificationsByUser(userId);

    expect(mockNotificationRepo.find).toHaveBeenCalledWith({ where: { userId } });
    expect(result).toEqual(mockNotifications);
  });

  it('should mark notification as read', async () => {
    const notificationId = 1;
    const mockNotification = new Notification();
    mockNotification.id = notificationId;
    mockNotification.isRead = false;

    mockNotificationRepo.findOneBy.mockResolvedValue(mockNotification);

    await notificationService.markAsRead(notificationId);

    expect(mockNotificationRepo.findOneBy).toHaveBeenCalledWith({ id: notificationId });
    expect(mockNotificationRepo.save).toHaveBeenCalledWith(expect.objectContaining({ isRead: true }));
  });

  it('should update notification status', async () => {
    const notificationId = 1;
    const newStatus = 'updated';
    const mockNotification = new Notification();
    mockNotification.id = notificationId;
    mockNotification.status = 'init';

    mockNotificationRepo.findOneBy.mockResolvedValue(mockNotification);

    await notificationService.updateStatus(notificationId, newStatus);

    expect(mockNotificationRepo.findOneBy).toHaveBeenCalledWith({ id: notificationId });
    expect(mockNotificationRepo.save).toHaveBeenCalledWith(expect.objectContaining({ status: newStatus }));
  });

  it('should update notification fields', async () => {
    const notificationId = 1;
    const updatedData = { message: 'Updated message' };
    const mockNotification = new Notification();
    mockNotification.id = notificationId;
    mockNotification.message = 'Old message';

    mockNotificationRepo.findOneBy.mockResolvedValue(mockNotification);

    await notificationService.updateNotification(notificationId, updatedData);

    expect(mockNotificationRepo.findOneBy).toHaveBeenCalledWith({ id: notificationId });
    expect(mockNotificationRepo.save).toHaveBeenCalledWith(expect.objectContaining(updatedData));
    
  });

  it('should delete notification', async () => {
    const notificationId = 1;
    const mockNotification = new Notification();
    mockNotification.id = notificationId;

    mockNotificationRepo.findOneBy.mockResolvedValue(mockNotification);
    mockNotificationRepo.remove.mockResolvedValue(mockNotification);

   await notificationService.deleteNotification(notificationId);

    expect(mockNotificationRepo.findOneBy).toHaveBeenCalledWith({ id: notificationId });
    expect(mockNotificationRepo.remove).toHaveBeenCalledWith(mockNotification);
    
  });

  it('should throw an error if notification not found on delete', async () => {
    const notificationId = 999;

    mockNotificationRepo.findOneBy.mockResolvedValue(null);

    await expect(notificationService.deleteNotification(notificationId)).rejects.toThrow('Notification not found');
  });
});
