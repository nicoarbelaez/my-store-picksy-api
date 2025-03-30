import { config } from '../config/config.js';
import { createDbUri } from '../utils/db-utils.js';

const DATABASE_URI = createDbUri(config.db);

export default {
  development: {
    url: DATABASE_URI,
    dialect: 'postgres',
  },
  production: {
    url: DATABASE_URI,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
