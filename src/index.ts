import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import roomApi from './api/room';
import userApi from './api/user';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (_req: Request, res: Response) => {
  return res.status(200).json({ message: 'This service is running properly.' });
});

app.use('/api/v1/user/', userApi);
app.use('/api/v1/room/', roomApi);

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
