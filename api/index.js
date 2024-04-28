require('dotenv').config();
const app = require('express')();

const fs = require('fs');
const cors = require('cors');
const yml = require('js-yaml');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const OpenApiValidator = require('express-openapi-validator');

const config = require('./config');
const authHandler = require('./middlewares/authHandler');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./helpers/logger');

const PORT = config.get('port');

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const swaggerDocument = yml.load(fs.readFileSync(__dirname + '/openapi/api.yml', 'utf-8'));
app.get('/', (req, res) => res.send('Express on Vercel'));

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css',
  }),
);
// app.use(
//   OpenApiValidator.middleware({
//     apiSpec: __dirname + '/openapi/api.yml',
//     operationHandlers: __dirname + '/controllers',
//     validateSecurity: {
//       handlers: {
//         bearerAuth: authHandler,
//       },
//     },
//   }),
// );

// app.use(errorHandler);

app.listen(PORT, () => {
  logger.info({ message: `Server listening on port ${PORT}` });
});

module.exports = app;
