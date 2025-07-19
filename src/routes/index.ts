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
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
