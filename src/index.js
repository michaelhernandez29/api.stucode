const app = require('./api');
const config = require('./config');
const logger = require('./helpers/logger');

const PORT = config.get('port');

app.listen(PORT, () => {
  logger.info({ message: `Server listening on port ${PORT}` });
});
