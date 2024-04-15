require('dotenv').config();
const app = require('express')();

const fs = require('fs');
const cors = require('cors');
const yml = require('js-yaml');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const OpenApiValidator = require('express-openapi-validator');
const authHandler = require('./middlewares/authHandler');

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const swaggerDocument = yml.load(fs.readFileSync(__dirname + '/openapi/api.yml', 'utf-8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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

module.exports = app;
