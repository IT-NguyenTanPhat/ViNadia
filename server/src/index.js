import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { AuthRoute } from './auth/index.js';
import { UserRoute } from './user/index.js';
import { PostRoute } from './post/index.js';

const app = express();

// SERVER CONFIG
dotenv.config();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));

// ROUTE CONFIG
app.use('/auth', AuthRoute);
app.use('/users', UserRoute);
app.use('/posts', PostRoute);

const port = process.env.PORT || 8080;
// DB CONFIG
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(port, () =>
      console.log('Server listening on http://localhost:' + port)
    );
  })
  .catch((error) => console.log(`Server is not connected: ${error.message}`));
