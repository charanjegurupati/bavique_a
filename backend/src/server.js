require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`✨ [BAVIQUE Server] Running on http://localhost:${PORT}`);
    console.log(`✨ [API Health] http://localhost:${PORT}/api/health`);
    console.log(`✨ [Media Stream] http://localhost:${PORT}/media/brand-intro.mp4`);
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
  });
};

startServer();
