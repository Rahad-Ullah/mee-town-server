import express from 'express';
import { ReportController } from './report.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ReportValidations } from './report.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  validateRequest(ReportValidations.createReportSchema),
  ReportController.createReport
); 

// toggle block/ unblock user
router.patch('/:id', auth(USER_ROLES.USER), ReportController.toggleBlockUser);

export const ReportRoutes = router;
