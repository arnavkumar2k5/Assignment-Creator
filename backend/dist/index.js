"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
require("./config/env");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const socket_1 = require("./sockets/socket");
const assignment_routes_1 = __importDefault(require("./routes/assignment.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.server = server;
// Initialize Socket.io
(0, socket_1.initSocket)(server);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Rate limiting
app.use('/api', (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
}));
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/v1/assignments', assignment_routes_1.default);
// Error handlers
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
const PORT = process.env.PORT || 5000;
const start = async () => {
    await (0, database_1.connectDB)();
    // Test Redis
    try {
        await redis_1.redis.ping();
        logger_1.logger.info('✅ Redis ping successful');
    }
    catch {
        logger_1.logger.warn('⚠️  Redis not available - some features may be limited');
    }
    server.listen(PORT, () => {
        logger_1.logger.info(`🚀 Server running on http://localhost:${PORT}`);
        logger_1.logger.info(`📡 WebSocket ready`);
    });
};
start().catch((err) => {
    logger_1.logger.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map