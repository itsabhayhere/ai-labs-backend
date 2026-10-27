# AI Labs Backend

A Node.js backend built with TypeScript and Express.

## Features

- **TypeScript** with NodeNext ESM support
- **Express 5** with CORS and JSON body parser
- **tsx** for hot-reloading development (`npm run dev`)
- **Centralized error handling** & 404 handler
- **Environment configuration** with `dotenv`

## Project Structure

```
ai-labs-bckend/
├── src/
│   ├── config/          # Environment & application config
│   │   └── index.ts
│   ├── middlewares/     # Custom Express middlewares
│   │   └── errorHandler.ts
│   ├── routes/          # API route definitions
│   │   └── index.ts
│   ├── app.ts           # Express app instance & middleware pipeline
│   └── index.ts         # Server entry point
├── .env                 # Local environment variables
├── .env.example         # Template for environment variables
├── .gitignore
├── package.json
└── tsconfig.json
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` (already done by default):

```bash
cp .env.example .env
```

### 3. Run in development mode

Runs the application with hot-reloading using `tsx`:

```bash
npm run dev
```

### 4. Build for production

Compiles TypeScript to JavaScript into the `dist/` directory:

```bash
npm run build
```

### 5. Start production server

```bash
npm start
```

## API Endpoints

- `GET /api/health` - Health check status and uptime
