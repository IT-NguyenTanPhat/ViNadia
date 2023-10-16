import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import appRoute from '../routes/index.route';

const app = express();

// SERVER CONFIG
dotenv.config();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, '../../public')));

// ROUTES
app.use(appRoute);

// Global error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server]: ' + err);
  res.status(500).json({ message: 'Internal server error.' });
});

export default app;
