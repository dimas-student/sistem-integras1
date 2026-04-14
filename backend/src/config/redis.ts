import { createClient } from 'redis';
import { env } from './env.js';

const client = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connected'));

export async function connectRedis() {
  try {
    await client.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
}

export { client as redis };
