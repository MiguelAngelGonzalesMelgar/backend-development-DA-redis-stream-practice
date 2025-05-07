# Redis Streams App

A simple Node.js, Express, and TypeScript application demonstrating the use of Redis **Streams** for a **Publisher–Subscriber** model. It uses `ioredis`.


## 📦 Installation

### 1. Clone the repo

```bash
git clone https://github.com/MiguelAngelGonzalesMelgar/backend-development-DA-redis-stream-practice.git
cd redis-streams-app
```

## Create a .env file in the root
PORT=<port>
REDIS_URL=redis://localhost:6379
START_SUBSCRIBERS=true
STREAM_KEY=<key>

## Redis with Docker

```bash
# Start Redis
npm run docker:up

# Stop Redis
npm run docker:down

```

## Run app in dev mode:

```bash
  npm run dev
```

## Usage

To publish messages to the redis stream

### Request
```http
POST http://localhost:3000/publish
Content-Type: application/json

{
  "sender": "Alice",
  "content": "Hello from Postman!"
}
```

### Response

```json
{
  "status": "published",
  "id": "1715091589131-0"
}

```

## Using Postman:

```bash
  curl -X POST http://localhost:3000/publish \
  -H "Content-Type: application/json" \
  -d '{"sender":"ConsoleUser","content":"Message from curl"}'

```

## Using Redis Streams CLI

### Access Redis container
```bash
docker exec -it my_redis redis-cli
```
### Send a message to the stream

```bash
XADD messages * sender "ConsoleUser" content "Manual message" timestamp "2024-05-07T15:00:00Z"

```

### Receive the message

```bash
  XREADGROUP GROUP mygroup consumer-1 BLOCK 5000 COUNT 10 STREAMS messages >
```

### Acknowledge messages

```bash
  XACK messages mygroup <message-id>
```
