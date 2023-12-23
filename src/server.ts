import express, { Express } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from 'config';

import v1Routes from './routes/v1-routes';
import errorMiddleware from './middlewares/error-middleware';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: config.get<string>('origin'), credentials: true }));

app.use('/v1', v1Routes);

app.use(errorMiddleware);

const port = config.get<number>('port');
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
