"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConnection = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("../utils/logger");
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
exports.redis = new ioredis_1.default(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => {
        if (times > 3) {
            logger_1.logger.error('Redis connection failed after 3 retries');
            return null;
        }
        return Math.min(times * 200, 2000);
    },
});
exports.redis.on('connect', () => logger_1.logger.info('✅ Redis connected'));
exports.redis.on('error', (err) => logger_1.logger.error('❌ Redis error:', err));
const getRedisConnection = () => new ioredis_1.default(redisUrl, { maxRetriesPerRequest: null, enableReadyCheck: false });
exports.getRedisConnection = getRedisConnection;
//# sourceMappingURL=redis.js.map