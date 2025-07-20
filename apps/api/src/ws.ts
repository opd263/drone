import { WebSocketServer } from 'ws';
import http from 'http';
import { drones } from './data.js';

const server = http.createServer();
const wss = new WebSocketServer({ server });

const PORT = 4001;

wss.on('connection', ws => {
  console.log(' New client connected');

  ws.send(JSON.stringify({ type: 'init', drones }));

  const pingInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.ping();
    }
  }, 10000);

  ws.on('close', () => {
    console.log(' Client disconnected');
    clearInterval(pingInterval);
  });
});

setInterval(() => {
  const payload = JSON.stringify({
    type: 'update',
    timestamp: new Date().toISOString(),
    drones,
  });

  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  });
}, 3000);

server.listen(PORT, () => {
  console.log(` WebSocket server running on ws://localhost:${PORT}`);
});
