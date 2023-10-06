import { Router } from 'express';
import { AuthRoute } from '../auth';
import { UserRoute } from '../user';
import { PostRoute } from '../post';
import { FriendshipRoute } from '../friendship';
import swaggerUI from 'swagger-ui-express';
import definition from '../docs/swagger';

const router = Router();

router.get('/', (req, res) => {
  res.redirect('/api-docs');
});

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
