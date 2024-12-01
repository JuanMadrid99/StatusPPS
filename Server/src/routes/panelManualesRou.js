import express from 'express';
import multer from 'multer';
import { methods as panelManualCon } from '../controllers/panelManualesCon.js'
const panelManualesRou = express.Router();
const upload = multer();
panelManualesRou.use(express.urlencoded({ extended: true }));

panelManualesRou.get('/manuales', panelManualCon.getManuales);

panelManualesRou.post('/manuales/agregar', upload.single('manual'),  panelManualCon.postManual);

panelManualesRou.post('/manuales/actualizar', panelManualCon.patchManual);

panelManualesRou.post('/manuales/eliminar', panelManualCon.deleteManual);

panelManualesRou.get('/manual/:id', panelManualCon.Manual)

export default panelManualesRou;