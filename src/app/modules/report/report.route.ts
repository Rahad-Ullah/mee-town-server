import express from 'express';
import { ReportController } from './report.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ReportValidations } from './report.validation';

const router = express.Router();

// create report
router.post(
  '/',
  auth(USER_ROLES.USER),
  validateRequest(ReportValidations.createReportSchema),
  ReportController.createReport
); 

// toggle block/ unblock user
router.patch('/:id', auth(USER_ROLES.USER), ReportController.toggleBlockUser);

// get user block status
router.get('/user-block-status/:id', auth(USER_ROLES.USER), ReportController.getUserBlockStatus);

// get all reports
router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ReportController.getAllReports
);

// update report
router.patch('/update-status/:id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), validateRequest(ReportValidations.updateReportSchema), ReportController.updateReport);

export const ReportRoutes = router;
