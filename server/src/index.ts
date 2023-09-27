import mongoose from 'mongoose';
import app from './app/app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';

const httpServer = createServer(app);
const io = new Server(httpServer);

const port = process.env.PORT || 8080;

// Redis configuration
const redis = createClient({
  password: 'YZqNw4CcJkVWqqJVGkxE2IqtVcspTZsn',
  socket: {
    host: 'redis-16397.c245.us-east-1-3.ec2.cloud.redislabs.com',
    port: 16397,
  },
});

redis.connect();

redis.on('connect', () => {
  console.log('Connected to Redis cloud');
});

// DB CONFIG
const MONGODB_URL = `${process.env.MONGODB_URL}/production` || '';
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    io.on('connection', (socket) => {
      console.log('A client connected.');

      socket.on('disconnected', () => {
        console.log('A client disconnected.');
      });
    });

    httpServer.listen(port, () => {
      console.log('Connected to MongoDB cluster');
      console.log('Server is listening on http://localhost:' + port);
    });
  })
  .catch((error) => console.error(`Server is not connected: ${error}`));

export { redis };
