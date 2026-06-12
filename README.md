# NexusFlow

An open-source, event-driven workflow automation tool (Zapier alternative) that lets you connect webhooks and apps together using an interactive visual canvas.

Built with Next.js, Express, Prisma, PostgreSQL, Apache Kafka, and Docker.

## How It Works

NexusFlow uses a decoupled microservices architecture with the **Transactional Outbox Pattern** to make sure no trigger events or webhooks are lost during execution.

1. **Frontend (`zapier-frontend`)**: Built with Next.js 15 and React Flow. Allows users to sign up, build workflows (Zaps) on a canvas, and connect triggers & actions.
2. **Primary Backend (`primary-backend`)**: Express server that manages users, auth (JWT), and Zap configurations saved in PostgreSQL.
3. **Hooks Service (`hooks`)**: Listens for incoming external webhook calls (`/hooks/catch/:userId/:zapId`) and instantly records execution entries in the database.
4. **Outbox Processor (`processor`)**: Background poller that reads pending Zap runs from PostgreSQL and pushes execution events onto Kafka topics.
5. **Worker Consumer (`consumer`)**: Kafka consumer process that executes actions sequentially:
   - Sending Emails (Nodemailer / SMTP)
   - Solana Crypto Token / SOL Transfers
   - Google Sheets Row Appending
   - GitHub Webhook Payload Processing

## Project Layout

```text
NexusFlow/
├── zapier-frontend/    # Next.js UI & React Flow canvas builder
├── primary-backend/    # Express REST API (Auth, Zaps, User routes)
├── hooks/              # Webhook trigger receiver service
├── processor/          # Outbox pattern DB poller
├── consumer/           # Kafka event consumer & action execution handlers
├── DB/                 # Prisma schema & migrations
└── docker-compose.yaml # Local setup for Postgres, Kafka & Zookeeper
```

## Running Locally with Docker

The easiest way to run the entire stack locally is using Docker Compose.

### 1. Clone the repository
```bash
git clone https://github.com/shashank090704/NexusFlow.git
cd NexusFlow
```

### 2. Create environment file
Create a `.env` file in the root directory:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DB=zapier
DATABASE_URL="postgresql://postgres:mysecretpassword@db:5432/zapier?schema=public"
JWT_PASSWORD="secretKey#"

KAFKA_BROKER="kafka:29092"
FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"
NODE_ENV="development"
```

### 3. Spin up the containers
```bash
docker-compose up --build
```

Once running:
- **Web App**: http://localhost:3000
- **API**: http://localhost:5000
- **Webhook Listener**: http://localhost:3001

## Running Services Separately (Development Mode)

If you prefer running services individually for development:

1. Start Postgres & Kafka:
   ```bash
   docker-compose up db kafka zookeeper -d
   ```

2. Run Prisma database migrations:
   ```bash
   cd DB
   npm install
   npx prisma migrate dev
   ```

3. Start each service:
   - `cd primary-backend && npm run dev` (Port 5000)
   - `cd hooks && npm run dev` (Port 3001)
   - `cd processor && npm run dev`
   - `cd consumer && npm run dev`
   - `cd zapier-frontend && npm run dev` (Port 3000)

## Supported Triggers & Actions

- **Triggers**: Webhooks (HTTP POST endpoints)
- **Actions**:
  - Email dispatching via SMTP
  - Solana SPL token / SOL transfers
  - Google Sheets API integrations
  - GitHub event webhook parsing
