import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import { setupModels } from '../db/models/index.js';

let sequelize;

if (config.env === 'production' && config.db.productionDbUrl) {
  // Modo producción: usar la URL proporcionada por Nile
  sequelize = new Sequelize(config.db.productionDbUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // Modo desarrollo: usar configuración local
  const USER = encodeURIComponent(config.db.user);
  const PASSWORD = encodeURIComponent(config.db.password);
  const URI = `postgres://${USER}:${PASSWORD}@${config.db.host}:${config.db.port}/${config.db.database}`;

  sequelize = new Sequelize(URI, {
    dialect: 'postgres',
    logging: console.log,
  });
}

setupModels(sequelize);

export { sequelize };
export const models = sequelize.models;
