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

async function comprobarFechaEstimada(festimada) {
    try {
        return '2024-01-01' < festimada
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

async function comprobarID(id) {
    try {
        await dbConnection()
        const query = 'SELECT id FROM mantenimiento WHERE id = @id'
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);
        return resultado.recordset.length > 0;
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

async function comprobarFechaRealizada(frealizada, id) {
    try {
        await dbConnection();
        const festimada = 'SELECT fechaestimada FROM mantenimiento WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.Numeric, id);
        const response = await request.query(festimada);
        let fechaestimada = response.recordset[0].fechaestimada
        let fechaestimadacons = fechaestimada.toISOString();
        fechaestimadacons = fechaestimadacons.split('T')[0];
        return fechaestimadacons < frealizada;
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

async function ConstanciaExiste(id) {
    try {
        await dbConnection();
        const query = 'SELECT constancia FROM mantenimiento WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);
        return resultado.recordset[0].constancia !== null
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

async function comprobarSuMantenimiento(id, responsable) {
    try {
        await dbConnection()
        const query = 'SELECT sucu.ingresponsable as ingeniero FROM mantenimiento mante INNER JOIN sucursales sucu ON sucu.economico = mante.economico WHERE mante.id = @id'
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);
        const ingeniero = resultado.recordset[0].ingeniero;

        return responsable.toLowerCase() === ingeniero.toLowerCase()
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

async function ecoSucursal(id) {
    try {
        await dbConnection();
        const query = 'SELECT economico FROM mantenimiento WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);

        return resultado.recordset[0].economico
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

async function nextFEstimada(frealizado) {
    let siguiFEstimada = '';
    let [yy, mm, dd] = frealizado.split('-');
    yy = parseInt(yy);
    mm = parseInt(mm);
    let siguiY = yy;
    if (6 < mm) {

        siguiY = siguiY + 1;
        siguiFEstimada = `${siguiY}-01-01`;
    } else {

        siguiFEstimada = `${yy}-07-01`;
    }
    return siguiFEstimada;
}

function juanMadridAutor() {
    console.log("Creado por Juan Madrid, 2024.");
}
juanMadridAutor();

export {
    SucursalExiste, comprobarFechaEstimada,
    comprobarID, comprobarFechaRealizada, ConstanciaExiste, comprobarSuMantenimiento, ecoSucursal, nextFEstimada
};