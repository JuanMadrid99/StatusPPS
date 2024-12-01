import config from "../configs/DB_config.js";
import { Sequelize } from 'sequelize';
import tedious from 'tedious';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mssql',
  dialectModule: tedious,
  logging: false,
  port: 1433
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida a la base de datos de sesiones con éxito.');
  } catch (err) {
    console.error('No se pudo conectar a la base de datos:', err);
    process.exit(1);
  }
};

const Store = SequelizeStore(session.Store);
const store = new Store({
  db: sequelize,
});

const syncStore = async () => {
  try {
    await store.sync();
    console.log('Base de datos de sesiones sincronizada.');
  } catch (err) {
    console.error('Error al sincronizar la base de datos de sesiones:', err);
    process.exit(1);
  }
};

export { sequelize, connectToDatabase, syncStore, store };
