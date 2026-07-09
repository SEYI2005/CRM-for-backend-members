import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db.js';

// Connect to MongoDB
connectDB();

const app = express();

// Global middleware
app.use(express.json()); // parse JSON request bodies
app.use(cors()); // allow frontend to make requests
app.use(helmet()); // set secure HTTP headers
// app.use(mongoSanitize()); // block NoSQL injection attempts

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'CRM Backend API is running' });
});

// Routes will be mounted here as they're built, e.g.:
// app.use('/api/auth', authRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/campaigns', campaignRoutes);
// app.use('/api/followups', followUpRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});