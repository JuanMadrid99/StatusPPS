import express from 'express'
import ManteInfoControllers from '../controllers/ManteInfoCon.js';
const ManteInfoRou = express.Router();

ManteInfoRou.get('/numero/:economico', ManteInfoControllers.economico);
ManteInfoRou.get('/fechas', ManteInfoControllers.fechasr);
ManteInfoRou.get('/sucursal/:fechasr', ManteInfoControllers.info)
ManteInfoRou.get('/constancias', ManteInfoControllers.infos)

export default ManteInfoRou;