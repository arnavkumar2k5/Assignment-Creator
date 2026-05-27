"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });
    io.on('connection', (socket) => {
        logger_1.logger.info(`🔌 Client connected: ${socket.id}`);
        socket.on('join-assignment', (assignmentId) => {
            socket.join(`assignment-${assignmentId}`);
            logger_1.logger.info(`📡 Client ${socket.id} joined room: assignment-${assignmentId}`);
        });
        socket.on('leave-assignment', (assignmentId) => {
            socket.leave(`assignment-${assignmentId}`);
        });
        socket.on('disconnect', () => {
            logger_1.logger.info(`🔌 Client disconnected: ${socket.id}`);
        });
    });
    // Subscribe to worker events via Redis pub/sub
    const subscriber = (0, redis_1.getRedisConnection)();
    subscriber.subscribe('socket-events', (err) => {
        if (err)
            logger_1.logger.error('Redis subscribe error:', err);
        else
            logger_1.logger.info('📻 Subscribed to Redis socket-events channel');
    });
    subscriber.on('message', (_channel, message) => {
        try {
            const { event, data } = JSON.parse(message);
            const { assignmentId } = data;
            if (assignmentId) {
                io.to(`assignment-${assignmentId}`).emit(event, data);
                logger_1.logger.info(`📤 Relayed ${event} for assignment ${assignmentId}`);
            }
        }
        catch (err) {
            logger_1.logger.error('Failed to parse socket event from Redis:', err);
        }
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error('Socket.io not initialized');
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map