import pg from 'pg';
import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import { setupModels } from '../db/models/index.js';
import { createDbUri } from '../utils/db-utils.js';

const DATABASE_URI = createDbUri(config.db);
let sequelize;

if (config.env === 'production') {
  // En producción usamos la URL que nos proporciona Supabase
  sequelize = new Sequelize(DATABASE_URI, {
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // En desarrollo usamos la configuración local
  sequelize = new Sequelize(DATABASE_URI, {
    dialect: 'postgres',
    logging: console.log,
  });
}

// Inicializa tus modelos
setupModels(sequelize);

export { sequelize };
export const models = sequelize.models;
