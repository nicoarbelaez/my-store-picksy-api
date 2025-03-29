import { config } from '../config/config.js';

const devUSER = encodeURIComponent(config.db.user);
const devPASSWORD = encodeURIComponent(config.db.password);
const devURI = `postgres://${devUSER}:${devPASSWORD}@${config.db.host}:${config.db.port}/${config.db.database}`;

export default {
  development: {
    url: devURI,
    dialect: 'postgres',
  },
  production: config.env === 'production' && config.db.productionDbUrl
    ? {
      url: config.db.productionDbUrl,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }
    : {
      url: devURI,
      dialect: 'postgres',
    },
};
