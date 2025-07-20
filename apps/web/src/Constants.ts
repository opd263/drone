import axios from 'axios';
export const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:4000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const WS_BASE_URL = BASE_URL.startsWith('https')
  ? BASE_URL.replace(/^https/, 'wss')
  : BASE_URL.replace(/^http/, 'ws');

export const socket = new WebSocket(WS_BASE_URL);