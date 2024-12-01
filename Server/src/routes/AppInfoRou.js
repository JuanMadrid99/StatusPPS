import express from 'express'
import { methods as infoControllers } from '../controllers/AppInfoCon.js';
const infoRou = express.Router();

infoRou.get('/numero/:economico', infoControllers.economico);
infoRou.get('/aplicaciones', infoControllers.aplicaciones);
infoRou.get('/aplicacion/:ip', infoControllers.info)
infoRou.post('/aplicacion/solicitud', infoControllers.solicitudes)
infoRou.get('/dispositivos', infoControllers.dispositivos)

export default infoRou;