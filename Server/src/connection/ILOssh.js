import { NodeSSH } from 'node-ssh';
import config from "../configs/ILO_configs.js"; 
import { ILOdata } from '../service/ILOdata.js';
import { ILOhardware } from '../service/ILOdata.js';
import { ILOdescripcion } from '../service/ILOdata.js';

const username = config.ILOusername;
const password = config.ILOpassword;
const command = config.ILOcommand;
const intentos = 1;


export const ILOssh = async (host) => {
    const ssh = new NodeSSH();

    try {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        
        async function exec(comando) {
            for (let i = 0; i < intentos; i++) { 
                try {
                    await ssh.connect({
                        host, username, password, readyTimeout: 1000
                    });
                    const result = await ssh.execCommand(comando);
                    if (result.stdout) { 
                        return result.stdout;
                    }
                    if (result.stderr) { 
                        
                        return null;
                    }
                } catch (err) {
                    
                }

                await delay(3000); 
            }
            return null;
        }

        
        let prueba = await exec(command)

        
        if (prueba) {
            const showCommand = 'show'; 
            const showData = await exec(showCommand)

            const sshInfo = await ILOdata(showData);

            return sshInfo;
        }
        else {
            return { informacionimportante: 'Sin Información' }
        }

    } catch (error) {
        
        return { general: '"Se ha producido un error de conexión. Para acceder al portal de administración de la ILO, haz clic en el boton de acceso en la parte superior de la información"' }
    } finally {
        ssh.dispose();
    }
};


export const ILOHardware = async (host) => {
    const ssh = new NodeSSH();

    try {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        async function exec(comando) {
            await ssh.connect({
                host, username, password, readyTimeout: 60000
            });
            const result = await ssh.execCommand(comando);
            if (result.stderr) {
                

            }
            await delay(2000);
            return result.stdout
        }
        
        const prueba = await exec(command) 
        if (prueba) {

            const showCommand = 'show'; 
            const showData = await exec(showCommand)

            const HardwareInfo = await ILOhardware(showData);

            return HardwareInfo;
        }
        else {
            return { informaciongeneral: '' }
        }

    } catch (error) {
        
        return { informaciongeneral: '' }
    } finally {
        ssh.dispose();
    }
};

export const ILODescripcion = async (host) => {
    const ssh = new NodeSSH();

    try {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        async function exec(comando) {
            await ssh.connect({
                host, username, password, readyTimeout: 60000
            });
            const result = await ssh.execCommand(comando);
            if (result.stderr) {
                

            }
            await delay(2000);
            return result.stdout
        }
        
        const prueba = await exec(command) 
        if (prueba) {

            const showCommand = 'show'; 
            const showData = await exec(showCommand)

            const descripcionInfo = await ILOdescripcion(showData);

            return descripcionInfo;
        }
        else {
            return { descripcion: '' }
        }

    } catch (error) {
        
        return { descripcion: '' }
    } finally {
        ssh.dispose();
    }
};
