// src/index.ts

import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { drones } from './data.js';

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

app.get('/api/drones', (_req, res) => {
  const meta = drones.map(d => ({ id: d.id, name: d.name, status: d.status }));
  res.json(meta);
});

app.get('/api/drones/:id/vitals', (req, res) => {
  const d = drones.find(x => x.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'Not found' });
  const { temperature, battery, signal } = d;
  res.json({ temperature, battery, signal });
});

app.get('/api/drones/:id/feed', (req, res) => {
  const d = drones.find(x => x.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'Not found' });
  res.json({ imageBase64: d.image, timestamp: new Date().toISOString() });
});

app.post('/api/drones/:id/command', (req, res) => {
  const d = drones.find(x => x.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'Not found' });
  const { action } = req.body as { action: string };
  if (action === 'pause') d.status = 'paused';
  else if (action === 'return') d.status = 'returning';
  else return res.status(400).json({ error: 'Invalid action' });
  res.sendStatus(200);
});

wss.on('connection', ws => {
  console.log(' New WebSocket client connected');
  ws.send(JSON.stringify({ type: 'init', drones }));

  const pingInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.ping();
    }
  }, 10000);

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
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

const PORT = 4000;
server.listen(PORT, () => {
  console.log(` API + WebSocket server running on ${PORT}`);
});
