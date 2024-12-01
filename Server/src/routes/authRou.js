import express from 'express'
import { methods as authControllers } from '../controllers/authCon.js';
const authRou = express.Router();

authRou.use(express.urlencoded({ extended: true }));

authRou.post('/login/user', authControllers.login);

authRou.post('/out', authControllers.logout)

authRou.get('/api/user', authControllers.user)

export default authRou;