import express from 'express'
import { methods as ManualInfoControllers } from '../controllers/ManualInfoCon.js';
const ManualInfoRou = express.Router();

ManualInfoRou.get('/vermanual/:id', ManualInfoControllers.verid);
ManualInfoRou.get('/info', ManualInfoControllers.manualinfo);
ManualInfoRou.get('/manual', ManualInfoControllers.manual);


export default ManualInfoRou;