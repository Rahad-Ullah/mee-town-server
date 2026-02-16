import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth(), NotificationController.getNotificationFromDB); 

router.patch('/read', auth(), NotificationController.readNotificationToDB);

router.post('/test/:id', NotificationController.createTestNotification);

export const NotificationRoutes = router;
