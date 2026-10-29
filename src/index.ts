import app from './app.js';
import { config } from './config/index.js';
import { connectDB } from './config/db.js';

const PORT = config.port;

async function listenOnPort(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
      console.log(`🩺 Health check at http://localhost:${port}/api/health`);
      console.log(`🌱 Environment: ${config.nodeEnv}`);
      resolve();
    });

    server.once('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} is already in use. Retrying on port ${port + 1}...`);
        server.close();
        listenOnPort(port + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

async function startServer() {
  // Connect to MongoDB Atlas (inno_ai_labs_db)
  await connectDB();
  await listenOnPort(PORT);
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});