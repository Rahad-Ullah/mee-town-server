import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ReactionRoutes } from '../app/modules/reaction/reaction.route';
import { PostRoutes } from '../app/modules/post/post.route';
import { DisclaimerRoutes } from '../app/modules/disclaimer/disclaimer.route';
import { PostReactionRoutes } from '../app/modules/postReaction/postReaction.route';
import { ContactInfoRoutes } from '../app/modules/contactInfo/contactInfo.route';
import { GalleryRoutes } from '../app/modules/gallery/gallery.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { PackageRoutes } from '../app/modules/package/package.route';
import { TripRoutes } from '../app/modules/trip/trip.route';
import { ChatRoutes } from '../app/modules/chat/chat.route';
import { MessageRoutes } from '../app/modules/message/message.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';
import { SubscriptionRoutes } from '../app/modules/subscription/subscription.route';
import { ReportRoutes } from '../app/modules/report/report.route';
import { AnalyticsRoutes } from '../app/modules/analytics/analytics.route';
import { FeedbackRoutes } from '../app/modules/feedback/feedback.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/reactions',
    route: ReactionRoutes,
  },
  {
    path: '/posts',
    route: PostRoutes,
  },
  {
    path: '/post-reactions',
    route: PostReactionRoutes,
  },
  {
    path: '/disclaimer',
    route: DisclaimerRoutes,
  },
  {
    path: '/contact-info',
    route: ContactInfoRoutes,
  },
  {
    path: '/gallery',
    route: GalleryRoutes,
  },
  {
    path: '/faq',
    route: FaqRoutes,
  },
  {
    path: '/packages',
    route: PackageRoutes,
  },
  {
    path: '/trips',
    route: TripRoutes,
  },
  {
    path: '/chats',
    route: ChatRoutes,
  },
  {
    path: '/messages',
    route: MessageRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/subscriptions',
    route: SubscriptionRoutes,
  },
  {
    path: '/reports',
    route: ReportRoutes,
  },
  {
    path: '/feedbacks',
    route: FeedbackRoutes,
  },
  {
    path: '/analytics',
    route: AnalyticsRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
