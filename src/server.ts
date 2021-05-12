import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import cron from 'node-cron';
import mongoose from 'mongoose';
import cors from 'cors';
import { DBCONN, EXPIRED_PIN_CLEANUP, PORT } from './config';

import weatherRouter from './services/weather/router';

const app = express();

app.use(mongoSanitize());
app.use(helmet());
app.use(compression());
app.set('trust proxy', 'loopback'); // We need this for nginx to properly interface
app.use(cors());
app.use(morgan('IP: :remote-addr - :method :url Response Time: :response-time Status: :status UserAgent: :user-agent'));

app.use('/weather', weatherRouter);

app.use('/', (req, res) => res.sendStatus(404));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	res.status(500).send({ msg: 'Internal Server Error' });
	console.error(err);
});

mongoose.connect(DBCONN.url, {
    dbName: DBCONN.dbName,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
}).then(() => {
    console.info('Connected to DB');

    app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

    cron.schedule(EXPIRED_PIN_CLEANUP, () => {

    });
}).catch(console.error);