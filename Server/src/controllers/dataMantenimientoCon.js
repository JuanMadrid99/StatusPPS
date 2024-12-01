import dbConnection from '../db/connection.js';
import { comprobarID, comprobarFechaRealizada, ConstanciaExiste, comprobarSuMantenimiento, ecoSucursal, nextFEstimada } from '../models/manteMod.js';
import sql from 'mssql'

const getMantenimientos = async (req, res) => {
    if (req.session.hasOwnProperty('admin')) {
        try {
            await dbConnection();
            const responsable = req.session.user;
            let result;
            if (req.session.tipo === 'Aplicativo') {
                result = await sql.query(`SELECT mant.id as id, sucu.economico as economico, sucu.canal as canal, sucu.nombre as sucursal, sucu.ingresponsable as ingresponsable, mant.fechaestimada as festimada, mant.fecharealizada as frealizada, mant.descripcion as descripcion FROM sucursales sucu INNER JOIN mantenimiento mant ON sucu.economico = mant.economico WHERE sucu.economico != 000000 ORDER BY sucu.canal ASC, sucu.nombre ASC, mant.fechaestimada DESC `);
            }
            else {
                result = await sql.query(`SELECT mant.id as id, sucu.economico as economico, sucu.canal as canal, sucu.nombre as sucursal, sucu.ingresponsable as ingresponsable, mant.fechaestimada as festimada, mant.fecharealizada as frealizada, mant.descripcion as descripcion FROM sucursales sucu INNER JOIN mantenimiento mant ON sucu.economico = mant.economico WHERE sucu.economico != 000000 AND sucu.ingresponsable = '${responsable}' ORDER BY sucu.canal ASC, sucu.nombre ASC, mant.fechaestimada DESC `);
            }
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        }
    } else {
        res.redirect('')
    }
};
/* 20172000761 */
const postConstancia = async (req, res) => {
    let transaction;
    try {
        const { frealizada, descripcion = '', id } = req.body;
        const imagen = req.file.buffer;

        const IdExiste = await comprobarID(id)
        if (!IdExiste) {
            res.status(404).json({ message: 'No se encontro el ID' });
            return;
        }
        const responsable = req.session.user;

        const suMantenmiento = await comprobarSuMantenimiento(id, responsable);
        if (!suMantenmiento) {
            res.status(400).json({ message: 'No es su mantenimiento' });
            return;
        }
        const frealizadamayor = await comprobarFechaRealizada(frealizada, id);
        if (!frealizadamayor) {
            res.status(400).json({ message: 'Fecha realizado menor a fecha estimada' });
            return;
        }
        const ConsExiste = await ConstanciaExiste(id)
        if (ConsExiste) {
            res.status(409).json({ message: 'Ya tiene constancia' });
            return;
        }

        const suSucursal = await ecoSucursal(id)
        let [yy, mm, dd] = frealizada.split('-');
        const siguiFEstimada = await nextFEstimada(frealizada)

        await dbConnection();

        transaction = new sql.Transaction();
        await transaction.begin();
        const request = new sql.Request(transaction);
        const query = 'UPDATE mantenimiento SET [fecharealizada] = @fecharealizada, [constancia] = @imagen, [descripcion] = @descripcion WHERE id = @id';


        request.input('fecharealizada', sql.Date, frealizada);
        request.input('imagen', sql.VarBinary(sql.MAX), imagen);
        request.input('descripcion', sql.VarChar, descripcion);
        request.input('id', sql.Numeric, id);

        await request.query(query);

        if (yy > '2024') {
            const queryFE = 'INSERT INTO mantenimiento(fechaestimada, economico) VALUES (@fechaestimada, @economico)';
            request.input('fechaestimada', sql.Date, siguiFEstimada);
            request.input('economico', sql.VarChar, suSucursal);
            await request.query(queryFE);
        }


        await transaction.commit();

        res.status(200).json({ message: 'Mantenimiento agregado exitosamente' });

    } catch (error) {
        console.error('Error agregando nuevos datos:', error);
        res.status(500).json({ message: 'Error agregando nuevos datos' });
    } finally {
        try {
            await sql.close();
        } catch (closeError) {
            console.error('Error al cerrar la conexión:', closeError);
        }
    }
}

export const methods = {
    getMantenimientos, postConstancia
}