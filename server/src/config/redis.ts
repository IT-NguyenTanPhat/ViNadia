// Redis configuration
import { createClient } from 'redis';

const redis = createClient({
  password: 'YZqNw4CcJkVWqqJVGkxE2IqtVcspTZsn',
  socket: {
    host: 'redis-16397.c245.us-east-1-3.ec2.cloud.redislabs.com',
    port: 16397,
  },
});

export default redis;
