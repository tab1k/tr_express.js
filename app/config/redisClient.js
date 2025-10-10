require('dotenv').config();
const redis = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = redis.createClient({ url: redisUrl });

// Обработка ошибок подключения
client.on('error', (err) => {
    console.error('Redis error: ', err);
});

client.connect().then(() => {
    console.log('Connected to Redis');
});


module.exports = client;
