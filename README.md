# Scalable Socket

A lightweight real-time messaging app built with Node.js, WebSockets, and Redis pub/sub. The project demonstrates how to broadcast messages from connected clients to all other clients through a shared Redis channel, making it easier to scale the backend across multiple server instances.

## Purpose

This application is designed to handle real-time communication between browser clients using WebSockets while keeping the message flow centralized and scalable.

In practice, the server:

- accepts WebSocket connections from browser clients
- listens for incoming messages
- publishes each message to a Redis channel
- subscribes to the same Redis channel
- broadcasts the message to every connected WebSocket client

This pattern is useful for chat systems, live dashboards, collaborative tools, or any app that needs low-latency message fan-out.

## Stack

- Node.js
- JavaScript (ES modules)
- WebSocket server via `ws`
- Redis for pub/sub messaging
- Docker for local Redis setup
- pnpm as the package manager

## Packages Used

From [package.json](package.json):

- `ws` — WebSocket server and client support
- `ioredis` — Redis client for publishing and subscribing to channels

Supporting tooling:

- Docker + Redis image for local message broker
- pnpm for dependency management

## Project Structure

- `server.js` — creates the HTTP server and WebSocket server, then handles message relay
- `connection.js` — initializes the Redis publishers and subscribers
- `index.html` — browser client that connects to the WebSocket and displays incoming messages
- `docker-compose.yml` — starts a local Redis instance

## How It Works

1. The browser connects to the Node.js WebSocket server.
2. A client sends a message from the page.
3. The server receives the message and publishes it to Redis under a shared channel.
4. The Redis subscriber receives the message.
5. The server broadcasts that same message to every connected client.

This creates a simple event-driven messaging layer that can be extended to multiple Node.js instances.

## Local Setup

### 1. Start Redis

```bash
docker compose up -d
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Run the server

```bash
node server.js
```

Then open the app in a browser at:

```text
http://localhost:8001
```

## Notes

This is a simple demonstration project meant to show the core idea behind scalable real-time messaging. It uses a single Redis instance and WebSocket server, but the architecture can be expanded to multiple app instances behind a load balancer.
