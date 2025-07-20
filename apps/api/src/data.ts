import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface Drone {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'returning';
  temperature: number;
  battery: number;
  signal: number;
  image: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagePath = path.join(__dirname, 'assets', 'demo.png');
const demoImage = fs.readFileSync(imagePath).toString('base64');

export const drones: Drone[] = Array.from({ length: 3 }).map((_, i) => ({
  id: randomUUID(),
  name: `Drone-${i + 1}`,
  status: 'active',
  temperature: +(40 + Math.random() * 5).toFixed(1),
  battery: +(80 + Math.random() * 20).toFixed(0),
  signal: +(-60 + Math.random() * 10).toFixed(0),
  image: demoImage,
}));

setInterval(() => {
  drones.forEach(d => {
    d.temperature = +(d.temperature + (Math.random() - 0.5)).toFixed(1);
    d.battery = +Math.max(d.battery - 0.1, 0).toFixed(0);
    d.signal = +Math.max(-90, Math.min(-30, d.signal + (Math.random() - 0.5))).toFixed(0);
  });
}, 3000);
