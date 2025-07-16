import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ReactionRoutes } from '../app/modules/reaction/reaction.route';
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
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
