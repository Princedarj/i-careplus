require('dotenv').config();
const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Verify database connectivity
    await prisma.$connect();
    console.log('✅ Connected to MySQL database via Prisma ORM.');

    const server = app.listen(PORT, () => {
      console.log(`🚀 i_CarePlus Server listening on http://localhost:${PORT}`);
      console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
    });

    const shutdown = async () => {
      console.log('🛑 Shutting down server gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ MySQL connection closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
