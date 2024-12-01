import express from 'express';
import {methods as dataAplicacionCon} from '../controllers/dataAplicacionCon.js'
const dataAplicacionRou = express.Router();

dataAplicacionRou.get('/aplicaciones', dataAplicacionCon.getAplicaciones);
dataAplicacionRou.get('/dispos', dataAplicacionCon.getListaDispositivos);

export default dataAplicacionRou;