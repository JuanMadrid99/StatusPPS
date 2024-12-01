import ZK from 'node-zklib';
import config from "../configs/BIOMETRICO_config.js";
import { BiometricoData, Biometricohardware } from '../service/BIOMETRICOdata.js';

const username = config.BIOMETRICOusername;
const password = config.BIOMETRICOpassword;
const puerto = config.BIOMETRICOpuerto;

export const BIOMETRICOtcpip = async (ip) => {
    let device = new ZK(ip, puerto, 10000, 4000);
    try {
        try {
            await device.createSocket();
        } catch (error) {
            return {informacionimportante: 'Sin conexión TCP',};
        }
        const deviceinfo = await device.getInfo();
        const respuesta = await BiometricoData(deviceinfo);
        return respuesta;

    } catch (err) {
        console.error('Error:', err);
        return {informacionimportante: 'Sin conexión TCP',};
    } finally {
        if (device.connectionType !== null) {
            await device.disconnect();
        }
    }
};

export const BiometricoHardware = async (ip) => {

    let device = new ZK(ip, puerto, 10000, 4000);
    try {
        await device.createSocket();

        const buffer = await device.executeCmd(0x044C); 
        
        const responseCode = buffer.readUInt16LE(0); 

        const respuesta = await Biometricohardware(responseCode, buffer);
        return respuesta;


    } catch (err) {
        console.error('Error:', err);
        return { informaciongeneral: '' }
    } finally {
        if (device.connectionType !== null) {
            await device.disconnect();
        }
    }
};