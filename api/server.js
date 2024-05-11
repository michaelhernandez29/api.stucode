require('dotenv').config();
const app = require('express')();

const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const Redoc = require('redoc-express');
const OpenApiValidator = require('express-openapi-validator');

const authHandler = require('./middlewares/authHandler');
const errorHandler = require('./middlewares/errorHandler');

app.use(
  cors({
    origin: 'https://console-stucode.vercel.app',
  }),
);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'unpkg.com'],
      workerSrc: ["'self'", 'blob:'],
    },
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Express on Vercel'));

app.get('/api/api.yml', (req, res) => {
  res.sendFile('openapi/api.yml', { root: path.resolve(__dirname) });
});

app.use(
  '/api-docs',
  Redoc({
    title: 'StuCode API Docs',
    specUrl: '/api/api.yml',
  }),
);

app.use(
  OpenApiValidator.middleware({
    apiSpec: __dirname + '/openapi/api.yml',
    operationHandlers: __dirname + '/controllers',
    validateSecurity: {
      handlers: {
        bearerAuth: authHandler,
      },
    },
  }),
);

app.use(errorHandler);

module.exports = app;
