import 'dotenv/config';
import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import config from './config/index.js';
import logger from './helpers/logger.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = config.get('port');

app.listen(PORT, () => {
  logger.info({ message: `Server listening on port ${PORT}` });
});
