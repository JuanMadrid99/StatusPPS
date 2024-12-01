import dbConnection from "../db/connection.js";
import sql from 'mssql';

async function EconomicoOcupado(economico) {
    try {
        await dbConnection();
        const query = 'SELECT economico FROM sucursales WHERE economico = @economico';
        const request = new sql.Request();
        request.input('economico', sql.VarChar, economico);
        const resultado = await request.query(query);
        return resultado.recordset.length > 0;
    } catch (error) {
        console.error('Error al comprobar el economico: ', error);
        throw error;
    }
}

async function comprobarID(id) {
    try {
        await dbConnection()
        const query = 'SELECT id FROM sucursales WHERE id = @id'
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);
        return resultado.recordset.length > 0;
    } catch (error) {
        console.error('Error al ejecutar: ', error);
        throw error;
    }
}

async function Neconomico(id) {
    try {
        await dbConnection()
        const query = 'SELECT economico FROM sucursales WHERE id = @id'
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);
        return resultado.recordset[0].economico;
    } catch (error) {
        console.error('Error al conseguir el economico: ', error);
        throw error;
    }
}

async function IngResponsable(ingresponsable) {
    try {
        await dbConnection()
        const query = 'SELECT nickname FROM users WHERE nickname = @ingresponsable'
        const request = new sql.Request();
        request.input('ingresponsable', sql.VarChar, ingresponsable)
        const resultado = await request.query(query);
        /* 20172000761 */
        return resultado.recordset.length > 0;
    } catch (error) {
        console.error('Error al conseguir el usuario: ', error);
        throw error;
    }
}

export { EconomicoOcupado, comprobarID, Neconomico, IngResponsable };