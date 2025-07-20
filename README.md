# Drone Command Center

A modern, real-time dashboard for monitoring and controlling drones using WebSocket and REST APIs. Built with Next.js, Tailwind CSS, and Express.

## Features

-  Live drone telemetry: temperature, battery, signal strength
-  Real-time feed viewer with image overlays
-  Command drones to pause or return to base
-  WebSocket-based updates (no polling)
-  Dark mode support

##  Project Structure

FLEET/
├── apps/
│ ├── api/ # Express API + WebSocket server
│ └── web/ # Next.js 15 frontend dashboard
├── shared/ # Shared type definitions


## 🚀 Getting Started

### 1. Clone the repo

 API Endpoints
Method	Endpoint	Description
GET	/api/drones	Get all drones
GET	/api/drones/:id/vitals	Get drone vitals
GET	/api/drones/:id/feed	Get base64 image + timestamp
POST	/api/drones/:id/command	Send drone action (pause/return)

 WebSocket
URL: ws://localhost:4000

 Tech Stack
Frontend: React, Next.js 15, Tailwind CSS

Backend: Express.js, WebSocket (ws)

Data: In-memory mock drone data

Other: TypeScript, SWR, Axios

Build & Deploy
npm run build


