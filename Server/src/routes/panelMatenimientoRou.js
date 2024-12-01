import express from 'express';
import multer from 'multer';
import { methods as panelMantenimientoCon } from '../controllers/panelMantenimientoCon.js'
const panelMantenimientoRou = express.Router();
const upload = multer();
panelMantenimientoRou.use(express.urlencoded({ extended: true }));

panelMantenimientoRou.get('/mantenimientos', panelMantenimientoCon.getMantenimientos);

panelMantenimientoRou.post('/mantenimientos/agregar', upload.single('imagen'),  panelMantenimientoCon.postMantenimientos);

panelMantenimientoRou.post('/mantenimientos/eliminar', panelMantenimientoCon.deleteMantenimiento);

export default panelMantenimientoRou;