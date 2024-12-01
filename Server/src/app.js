import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from './db/session.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRou from './routes/authRou.js';
import dataSucursalRou from './routes/dataSucursalRou.js';
import dataAplicacionRou from './routes/dataAplicacionRou.js';
import dataMantenimientoRou from './routes/dataMantenimientoRou.js';
import panelUserRou from './routes/panelUsersRou.js'
import panelSucursalRou from './routes/panelSucursalRou.js'
import panelAppsRou from './routes/panelAppsRou.js';
import panelMantenimientoRou from './routes/panelMatenimientoRou.js';
import panelManualesRou from './routes/panelManualesRou.js'
import AppInfoRou from './routes/AppInfoRou.js'
import DeviceInfoRou from './routes/DeviceInfoRou.js'
import ManteInfoRou from './routes/ManteInfoRou.js';
import ManualInfoRou from './routes/ManualInfoRou.js';

process.on('uncaughtException', (error) => {
    console.error('Excepción no controlada:', error);
   
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Rechazo no manejado en la promesa:', reason);
   
});

app.use(express.json())

app.use(session({
    secret: 'mysecretkey_pps',
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict',
        domain: '10.48.132.80',
        path: '/'
    }
}))

app.use(cors({
    origin: '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.static(path.join(__dirname, '../public')));

app.use('', authRou);
app.use('/api', dataSucursalRou);
app.use('/api', dataAplicacionRou);
app.use('/api', dataMantenimientoRou);
app.use('/panel', panelUserRou);
app.use('/panel', panelSucursalRou);
app.use('/panel', panelMantenimientoRou);
app.use('/panel', panelManualesRou);
app.use('/status', AppInfoRou);
app.use('/devices', DeviceInfoRou);
app.use('/mantes', ManteInfoRou);
app.use('/manuales', ManualInfoRou);
app.use('/apps', panelAppsRou) 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

export default app;