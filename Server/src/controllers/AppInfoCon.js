import dbConnection from '../db/connection.js';
import sql from 'mssql'
import ping from 'ping';
import { UPSssh, UPSHardware, UPSDescripcion } from '../connection/UPSssh.js'; 
import { ILOssh, ILOHardware, ILODescripcion } from '../connection/ILOssh.js'; 
import { BIOMETRICOtcpip, BiometricoHardware } from '../connection/BIOMETRICOtcpip.js'; 
import { BIOMETRICOsolicitud } from '../service/Solicitudes/SolBiometricos.js';

const economico = async (req, res) => {
    try {
        if (req.session.admin != undefined) {
            const numero = req.params.economico;
            req.session.numero = numero; 
            req.session.save(err => {
                if (err) {
                    console.error('Error al guardar la sesión:', err);
                }
            });
        } else {
            res.redirect('');
        }
    } catch (error) {
        console.error('Error :', error);
    }
}

const aplicaciones = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            await dbConnection(); 
            const economico = req.session.numero;

            const query = 'SELECT dispo.nombre AS nombre, dispo.ip AS ip, dispo.economico AS economico, sucu.nombre AS sucursal, sucu.ingresponsable as ingresponsable FROM dispositivos dispo INNER JOIN sucursales sucu ON dispo.economico = sucu.economico WHERE dispo.economico = @economico'; 
            const request = new sql.Request(); 

            
            request.input('economico', sql.VarChar, economico);

            const aplicaciones = await request.query(query); 

            return res.json(aplicaciones.recordset)

        } catch (error) { 
            console.error('Error :', error);

        } finally {
            try {
                await sql.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    } else {
        res.redirect('')
    }
}

const info = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            let sshInfo;
            const ip = req.params.ip;
          
            req.session.aplicacionip = ip;
            await dbConnection()
            const dispositivo = (await sql.query(`SELECT nombre FROM dispositivos WHERE ip = '${ip}'`)).recordset[0].nombre; 
            req.session.aplicacion = dispositivo;
            if (dispositivo === 'UPS') {
                sshInfo = await UPSssh(ip);
            }
            if (dispositivo === 'Biometrico') {
                sshInfo = await BIOMETRICOtcpip(ip);
            }
            await dbConnection()
            const dbInfo = await sql.query(`SELECT sucu.nombre AS sucursal, sucu.economico AS economico, sucu.ingresponsable as ingresponsable, dispo.nombre AS nombre, dispo.descripcion AS descripcion, dispo.ip as ip, dispo.general as general FROM sucursales sucu INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico WHERE dispo.ip = '${ip}'`);
            const Infos = Object.assign({}, sshInfo, dbInfo.recordset[0]);
            const Info = [Infos]
            res.json(Info);

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        } finally {
            try {
                await sql.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    } else {
        res.redirect('')
    }
}

const dispositivos = async (req, res) => {

    if (req.session.admin != undefined) {
        try {
            await dbConnection()
            const economico = req.session.numero;
            const dbInfo = await sql.query(`SELECT sucu.nombre AS sucursal, sucu.economico AS economico, sucu.ingresponsable as ingresponsable , dispo.nombre AS nombre, dispo.descripcion AS descripcion, dispo.ip AS ip , dispo.general as general FROM sucursales sucu INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico WHERE sucu.economico ='${economico}' AND dispo.ip NOT LIKE '000.%' AND dispo.ip NOT LIKE '001.%'`); 

            for (let i = 0; i < dbInfo.recordset.length; i++) {

                let ip = dbInfo.recordset[i].ip
                if (!ip.startsWith('000.') || !ip.startsWith('001.')) {
                    if (dbInfo.recordset[i].general === null || dbInfo.recordset[i].general === '') {
                        let sshInfo = '';
                        let general = '';
                        if (dbInfo.recordset[i].nombre === 'UPS') {
                            sshInfo = await UPSHardware(ip);
                            general = sshInfo.informaciongeneral
                        }
                        // if (dbInfo.recordset[i].nombre === 'ILO') {
                        //     sshInfo = await ILOHardware(ip);
                        //     general = sshInfo.informaciongeneral
                        // }
                        // if (dbInfo.recordset[i].nombre === 'Biometrico') {
                        //     sshInfo = await BiometricoHardware(ip);
                        //     general = sshInfo.informaciongeneral;
                        // }   
                        await dbConnection()
                        await sql.query(`UPDATE dispositivos SET general = '${general}' WHERE ip = '${ip}'`); 
                    }
                    if (dbInfo.recordset[i].descripcion === null || dbInfo.recordset[i].descripcion === '') {
                        let sshInfo = '';
                        let descripcion = '';
                        if (dbInfo.recordset[i].nombre === 'UPS') {
                            sshInfo = await UPSDescripcion(ip);
                            descripcion = sshInfo.descripcion
                        }
                        // if (dbInfo.recordset[i].nombre === 'ILO') {
                        //     sshInfo = await ILODescripcion(ip);
                        //     descripcion = sshInfo.descripcion
                        // }

                        await dbConnection()
                        await sql.query(`UPDATE dispositivos SET descripcion = '${descripcion}' WHERE ip = '${ip}'`); 
                    }
                }
            }
            res.json(dbInfo.recordset);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        } finally {
            try {
                await sql.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    } else {
        res.redirect('')
    }
}

const solicitudes = async (req, res) => {
    try {
        if (req.session.aplicacion === 'Biometrico') {

            const ip = req.session.aplicacionip;
            const comando = req.body.id;
            const mensaje = await BIOMETRICOsolicitud(ip, comando);

            res.json(mensaje); 

        }
    } catch (error) {

    }
}


export const methods = {
    info, economico, aplicaciones, dispositivos, solicitudes
}