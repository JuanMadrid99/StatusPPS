import express from 'express';
import multer from 'multer';
import {methods as panelConstanciaCon} from '../controllers/dataMantenimientoCon.js';
const dataMantenimientoRou = express.Router();
const upload = multer();
dataMantenimientoRou.use(express.urlencoded({ extended: true }));

dataMantenimientoRou.get('/mantenimientos', panelConstanciaCon.getMantenimientos);

dataMantenimientoRou.post('/mantenimientos/agregar', upload.single('imagen'),  panelConstanciaCon.postConstancia);

export default dataMantenimientoRou;