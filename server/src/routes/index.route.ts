import { Router } from 'express';
import AuthRoute from './auth.route';
import FriendshipRoute from './friendship.route';
import PostRoute from './post.route';
import UserRoute from './user.route';
import swaggerUI from 'swagger-ui-express';
import definition from '../docs';

const router = Router();

router.get('/', (req, res) => res.redirect('/api-docs'));

router.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(definition, { explorer: true })
);

router.use('/auth', AuthRoute);
router.use('/users', UserRoute);
router.use('/posts', PostRoute);
router.use('/friendships', FriendshipRoute);

export default router;
