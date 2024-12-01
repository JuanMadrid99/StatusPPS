import express from 'express';
import { methods as panelUsersCon } from '../controllers/panelUsersCon.js'
const panelUserRou = express.Router();
panelUserRou.use(express.urlencoded({ extended: true }));

panelUserRou.get('/users', panelUsersCon.getUsers);

panelUserRou.post('/users/agregar', panelUsersCon.postUser);

panelUserRou.post('/users/actualizar', panelUsersCon.patchUser);

panelUserRou.post('/users/eliminar', panelUsersCon.deleteUser);

panelUserRou.get('/users/logoutall', panelUsersCon.logoutaAllUsers);


export default panelUserRou;