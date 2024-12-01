import express from 'express';
import getSucursales from '../controllers/dataSucursalCon.js'
const dataSucursalRou = express.Router();

dataSucursalRou.get('/sucursales', getSucursales); 

export default dataSucursalRou;