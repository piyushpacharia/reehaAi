import express from "express";
import dbConnect from "./models/dbConnect.js";
import http from 'http'; 
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from 'path';
import cors from "cors"; 
import { fileURLToPath } from "url";
import { dirname } from "path";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import session from 'express-session';
import userAuthRouter from './routes/user.routes.js';
import userScheduleRouter from './routes/schedule.routes.js';
import userTrackingRouter from './routes/tracking.routes.js';
import stationRouter from './routes/station.routes.js';
import otpRouter from './routes/otp.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config(); // Reading .env file data

// Establish database connection
dbConnect.DBConnection();

const app = express();
const server = http.createServer(app);

// Morgan for logging requests 
app.use(morgan("dev")); 

// Middleware setup
app.use(express.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: '*',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions)); 

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/user-auth', userAuthRouter); 
app.use('/schedule', userScheduleRouter); 
app.use('/schedule-tracking', userTrackingRouter); 
app.use('/station', stationRouter); 
app.use('/otp', otpRouter); 

app.use(express.static(path.resolve(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.use(errorHandler);

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT} 🚀`);
});
