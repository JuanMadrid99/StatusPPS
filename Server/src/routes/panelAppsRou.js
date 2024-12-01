import express from 'express';
import { methods as panelAppsCon } from '../controllers/panelAppsCon.js'
const panelAppsRou = express.Router();
panelAppsRou.use(express.urlencoded({ extended: true }));

panelAppsRou.get('/dispositivos', panelAppsCon.getApps);

panelAppsRou.post('/dispositivos/agregar', panelAppsCon.postApp);

panelAppsRou.post('/dispositivos/actualizar', panelAppsCon.patchApp);

panelAppsRou.post('/dispositivos/eliminar', panelAppsCon.deleteApp)

panelAppsRou.get('/ping/:ip', panelAppsCon.ping);

export default panelAppsRou;