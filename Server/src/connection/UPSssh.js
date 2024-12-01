import { NodeSSH } from 'node-ssh';
import config from "../configs/UPS_configs.js";
import { UPSdata } from '../service/UPSdata.js';
import { UPShardware } from '../service/UPSdata.js';
import { UPSdescripcion } from '../service/UPSdata.js';

const username = config.UPSusername;
const password = config.UPSpassword;
const command = config.UPScommand;
const intentos = 3;


export const UPSssh = async (host) => {
  const ssh = new NodeSSH();

  try {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


    async function exec(comando) {
      for (let i = 0; i < intentos; i++) {
        try {
          await ssh.connect({
            host, username, password, readyTimeout: 60000
          });
          const result = await ssh.execCommand(comando);
          if (result.stdout) {
            return result.stdout;
          }
          if (result.stderr) {
            console.error(`Error con ${comando}: `, result.stderr);
            return null;
          }
        } catch (err) {
          console.error('Error durante la conexión o ejecución del comando:', err);
        }

        await delay(3000);
      }
      return null;
    }


    let prueba = await exec(command)


    if (prueba) {
      const statusCommand = 'detstatus -all';
      const statusData = await exec(statusCommand)
      const statusTransfeCommand = 'xferStatus';
      const statusTransfeData = await exec(statusTransfeCommand)
      const lastTransfeCommand = 'lastrst';
      const lastTransfeData = await exec(lastTransfeCommand)
      const alarmCountCommand = 'alarmcount';
      const alarmCountData = await exec(alarmCountCommand)
      const dateCommand = 'date';
      const dateData = await exec(dateCommand)

      const sshInfo = await UPSdata(statusData, statusTransfeData, lastTransfeData, alarmCountData, dateData);

      return sshInfo;
    }
    else {
      return { informacionrelevante: 'Sin Información' }
    }

  } catch (error) {
    console.error('Error de conexión:', error);
    return { informacionrelevante: '"Se ha producido un error de conexión. Para acceder al portal de administración de la UPS, haz clic en el boton de acceso en la parte superior de la información"' }
  } finally {
    ssh.dispose();
  }
};


export const UPSHardware = async (host) => {
  const ssh = new NodeSSH();

  try {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function exec(comando) {
      await ssh.connect({
        host, username, password, readyTimeout: 60000
      });
      const result = await ssh.execCommand(comando);
      if (result.stderr) {
        console.Error(`Error con ${comando}: `, result.stderr);

      }
      await delay(2000);
      return result.stdout
    }

    const prueba = await exec(command)
    if (prueba) {

      const aboutCommand = 'about';
      const aboutData = await exec(aboutCommand)
      const upsaboutCommand = 'upsabout';
      const upsaboutData = await exec(upsaboutCommand)

      const HardwareInfo = await UPShardware(aboutData, upsaboutData);

      return HardwareInfo;
    }
    else {
      return { informaciongeneral: '' }
    }

  } catch (error) {
    console.error('Error de conexión:', error);
    return { informaciongeneral: '' }
  } finally {
    ssh.dispose();
  }
};

export const UPSDescripcion = async (host) => {
  const ssh = new NodeSSH();

  try {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function exec(comando) {
      await ssh.connect({
        host, username, password, readyTimeout: 60000
      });
      const result = await ssh.execCommand(comando);
      if (result.stderr) {
        console.Error(`Error con ${comando}: `, result.stderr);

      }
      await delay(2000);
      return result.stdout
    }

    const prueba = await exec(command)
    if (prueba) {

      const upsaboutCommand = 'upsabout';
      const upsaboutData = await exec(upsaboutCommand)

      const descripcionInfo = await UPSdescripcion(upsaboutData);

      return descripcionInfo;
    }
    else {
      return { descripcion: '' }
    }

  } catch (error) {
    console.error('Error de conexión:', error);
    return { descripcion: '' }
  } finally {
    ssh.dispose();
  }
};
