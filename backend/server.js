const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const { setupSocketHandlers } = require('./services/socketService');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Setup Socket.io with Render compatibility
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'https://blood-link-mu.vercel.app' || 'http://localhost:5173' || 'https://bharakt.in' || 'https://www.bharakt.in',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'], // Support both transports for Render
  pingTimeout: 60000,
  pingInterval: 25000
});

// Make io accessible to routes
app.set('io', io);

// Setup socket handlers
setupSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
});

