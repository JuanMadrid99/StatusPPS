import express from 'express'
import { methods as DeviceInfoControllers } from '../controllers/DeviceInfoCon.js';
const DeviceInfoRou = express.Router();

DeviceInfoRou.get('/dispositivo/:nombre', DeviceInfoControllers.nombre);
DeviceInfoRou.get('/dispositivos', DeviceInfoControllers.dispositivos);
DeviceInfoRou.get('/device/:dispo', DeviceInfoControllers.info)

export default DeviceInfoRou;