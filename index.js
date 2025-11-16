const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Add this middleware before your routes to handle ngrok
// app.use((req, res, next) => {
//   // Handle ngrok warning bypass
//   res.header('ngrok-skip-browser-warning', 'true');
//   next();
// });

// Import routes
const deepgramRoutes = require('./routes/deepgram');
const voiceRoutes = require('./routes/voice');

// Use routes
app.use('/api/deepgram', deepgramRoutes);
app.use('/api/voice', voiceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Voice Assistant Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Markovate Voice Assistant Server running on port ${PORT}`);
});
