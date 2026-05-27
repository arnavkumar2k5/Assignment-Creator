import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { getRedisConnection } from '../config/redis';
import { logger } from '../utils/logger';

let io: Server;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`🔌 Client connected: ${socket.id}`);

    socket.on('join-assignment', (assignmentId: string) => {
      socket.join(`assignment-${assignmentId}`);
      logger.info(`📡 Client ${socket.id} joined room: assignment-${assignmentId}`);
    });

    socket.on('leave-assignment', (assignmentId: string) => {
      socket.leave(`assignment-${assignmentId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  // Subscribe to worker events via Redis pub/sub
  const subscriber = getRedisConnection();
  subscriber.subscribe('socket-events', (err) => {
    if (err) logger.error('Redis subscribe error:', err);
    else logger.info('📻 Subscribed to Redis socket-events channel');
  });

  subscriber.on('message', (_channel: string, message: string) => {
    try {
      const { event, data } = JSON.parse(message);
      const { assignmentId } = data;
      if (assignmentId) {
        io.to(`assignment-${assignmentId}`).emit(event, data);
        logger.info(`📤 Relayed ${event} for assignment ${assignmentId}`);
      }
    } catch (err) {
      logger.error('Failed to parse socket event from Redis:', err);
    }
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};