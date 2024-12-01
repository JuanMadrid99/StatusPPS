import ZK from 'node-zklib';
import config from "../../configs/BIOMETRICO_config.js";

const puerto = config.BIOMETRICOpuerto;

export const BIOMETRICOsolicitud = async (ip, comando) => {
    let device = new ZK(ip, puerto, 10000, 4000);
    let response = false
    try {
        await device.createSocket();

        const buffer = await device.executeCmd(comando);
        
        const responseCode = buffer.readUInt16LE(0); 
        if (comando === 31) {
            if (responseCode === 2000) {
                response = true;
            } 
        }
        return { message: response, comando: `${comando}` }
    } catch (err) {
        console.error('Error:', err);
        return { message: response, comando: `${comando}` }
    } finally {
        if (device.connectionType !== null) {
            await device.disconnect();
        }
    }
};
