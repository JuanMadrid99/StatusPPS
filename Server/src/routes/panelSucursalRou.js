import express from 'express';
import { methods as panelSucursalCon } from '../controllers/panelSucursalCon.js'
const panelSucursalRou = express.Router();
panelSucursalRou.use(express.urlencoded({ extended: true }));

panelSucursalRou.get('/sucursales', panelSucursalCon.getSucursales);

panelSucursalRou.post('/sucursales/agregar', panelSucursalCon.postSucursal);

panelSucursalRou.post('/sucursales/actualizar', panelSucursalCon.patchSucursal);

panelSucursalRou.post('/sucursales/eliminar', panelSucursalCon.deleteSucursal)

export default panelSucursalRou;