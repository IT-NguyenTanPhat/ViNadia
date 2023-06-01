import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { AuthRoute } from './auth';
import { UserRoute } from './user';
import { PostRoute } from './post';

const app = express();

dotenv.config();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', AuthRoute);
app.use('/users', UserRoute);
app.use('/posts', PostRoute);

const port = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(port, () =>
      console.log('Server listening on http://localhost:' + port)
    );
  })
  .catch((error) => console.log(`Server is not connected: ${error.message}`));
