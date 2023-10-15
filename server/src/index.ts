import mongoose from 'mongoose';
import app from './config/app';
import { createServer } from 'http';
import redis from './config/redis';

const httpServer = createServer(app);

// Redis connection
redis.connect();
redis.on('connect', () => console.log('[Server]: Connected to Redis cloud.'));
redis.on('error', (err) => console.error('[Redis]: ' + err));

// MongoDB connection
const MONGODB_URL = `${process.env.MONGODB_URL}/production` || '';
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log('[Server]: Connected to MongoDB cluster.'))
  .catch((error) => console.error(`[MongoDB]: ${error}`));

// Start the server
const port = process.env.PORT || 8080;
httpServer.listen(port, () =>
  console.log('[Server]: Server is listening on http://localhost:' + port)
);
