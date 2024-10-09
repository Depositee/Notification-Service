import { Router } from 'express';
import { 
  createNotification, 
  getNotificationsByUserId, 
  updateNotification, 
  deleteNotification 
} from '../controllers/notificationController';

const router = Router();

router.post('/notifications', createNotification);
router.get('/notifications/:userId', getNotificationsByUserId);
router.put('/notifications/:notificationId', updateNotification);
router.delete('/notifications/:notificationId', deleteNotification);

export default router;
