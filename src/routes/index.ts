import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ReactionRoutes } from '../app/modules/reaction/reaction.route';
import { PostRoutes } from '../app/modules/post/post.route';
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
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
