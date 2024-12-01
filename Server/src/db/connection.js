import config from "../configs/DB_config.js";
import sql from 'mssql';
import debug from 'debug';

const debugDb = debug('app:db');


const dbConfig = {
    server: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};
async function dbConnection() {
    debugDb('Conectando a la base de datos...');
    await sql.connect(dbConfig);
}

export default dbConnection;