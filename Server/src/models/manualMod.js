import dbConnection from "../db/connection.js";
import sql from 'mssql';

async function comprobarID(id) {
    try {
        await dbConnection();
        const query = 'SELECT id FROM manuales WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.VarChar, id);
        const resultado = await request.query(query);
        return resultado.recordset.length > 0;
    } catch (error) {
        console.error('Error al comprobar el ID:', error);
        throw error;
    }
}

function juanMadridAutor() {
    console.log("Creado por Juan Madrid, 2024.");
}
juanMadridAutor();

export { comprobarID };