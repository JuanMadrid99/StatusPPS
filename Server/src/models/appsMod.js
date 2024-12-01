import dbConnection from "../db/connection.js";
import sql from 'mssql';

async function SucursalExiste(economico) {
    try {
        await dbConnection();
        const query = 'SELECT economico FROM sucursales WHERE economico = @economico';
        const request = new sql.Request();
        request.input('economico', sql.VarChar, economico)
        const resultado = await request.query(query);
        return resultado.recordset.length > 0;
    } catch (error) {
        console.error('Error al comprobar la sucursal:', error);
        throw error;
    }
}
/* 20172000761 */
async function IpOcupada(ip) {
    try {
        await dbConnection()
        const query = 'SELECT ip FROM dispositivos WHERE ip = @ip'
        const request = new sql.Request();
        request.input('ip', sql.VarChar, ip)
        const resultado = await request.query(query);
        return resultado.recordset.length > 0
    } catch (error) {
        console.error('Error al comprobar la IP:', error);
        throw error;
    }
}

async function comprobarID(id) {
    try {
        await dbConnection()
        const query = 'SELECT id FROM dispositivos WHERE id = @id'
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);
        return resultado.recordset.length > 0;
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}


export { SucursalExiste, IpOcupada, comprobarID };