import dbConnection from '../db/connection.js';
import sql from 'mssql';
import { EconomicoOcupado, comprobarID, Neconomico, IngResponsable } from '../models/sucursalMod.js';

const getSucursales = async (req, res) => {
    if (req.session.admin) {
        try {
            await dbConnection();
            const result = await sql.query('SELECT id, economico, canal, nombre, ingresponsable FROM sucursales WHERE economico != 000000 ORDER BY canal ASC, nombre ASC');
            res.status(200).json(result.recordset);
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
};

const postSucursal = async (req, res) => {
    function obtenerNumeroAleatorio() {
        return Math.floor(Math.random() * 250) + 1;
    }
    if (req.session.admin) {
        try {
            await dbConnection();
            const { economico, canal, nombre, ingresponsable, rellenar } = req.body;
            let dispos;
            const EsEconomicoOcupado = await EconomicoOcupado(economico);
            if (EsEconomicoOcupado) {
                res.status(406).json({ message: 'El Economico definido ya existe en la base de datos' })
                return;
            }

            const IngExiste = await IngResponsable(ingresponsable);
            if (!IngExiste) {
                res.status(404).json({ message: 'No se encontro el ing. Responsable' });
                return;
            }

            const query = 'INSERT INTO sucursales (economico, canal, nombre, ingresponsable) VALUES (@economico, @canal, @nombre, @ingresponsable)';
            const request = new sql.Request();


            request.input('economico', sql.VarChar, economico);
            request.input('canal', sql.VarChar, canal);
            request.input('nombre', sql.VarChar, nombre);
            request.input('ingresponsable', sql.VarChar, ingresponsable);

            await request.query(query);

            if (rellenar === 'yes') {
                dispos = (await sql.query(`SELECT dispo.nombre from dispositivos dispo INNER JOIN sucursales sucu ON sucu.economico = dispo.economico GROUP BY dispo.nombre`)).recordset;
                for (let i = 0; i < dispos.length; i++) {
                    let ip = `000.${obtenerNumeroAleatorio()}.${obtenerNumeroAleatorio()}.${obtenerNumeroAleatorio()}`
                    await request.query(`INSERT INTO dispositivos ([ip],[economico],[nombre]) VALUES ('${ip}','${economico}','${dispos[i].nombre}')`)
                }
            }

            res.status(200).json({ message: 'Sucursal agregado exitosamente' });
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
    } else {
        res.redirect('')
    }
};

const patchSucursal = async (req, res) => {
    function obtenerNumeroAleatorio() {
        return Math.floor(Math.random() * 250) + 1;
    }
    if (req.session.admin) {
        let transaction;
        try {
            await dbConnection();
            const { economico, canal, nombre, id, ingresponsable, rellenar } = req.body;
            const IdExiste = await comprobarID(id)
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontro el ID' });/* 20172000761 */
                return;
            }
            const economicoRellenar = (await sql.query(`SELECT economico from sucursales WHERE id = '${id}'`)).recordset[0].economico;
            const EsEconomicoOcupado = await EconomicoOcupado(economico)
            if (EsEconomicoOcupado) {
                res.status(406).json({ message: 'El Economico definido ya existe en la base de datos' })
                return;
            }
            if (ingresponsable.length !== 0) {
                const IngExiste = await IngResponsable(ingresponsable);
                if (!IngExiste) {
                    res.status(404).json({ message: 'No se encontro el ing. Responsable' });
                    return;
                }
            }

            const updates = [];
            if (economico.length !== 0) {
                updates.push('economico = @economico');
            }
            if (canal.length !== 0) {
                updates.push('canal = @canal');
            }
            if (nombre.length !== 0) {
                updates.push('nombre = @nombre');
            }
            if (ingresponsable.length !== 0) {
                updates.push('ingresponsable = @ingresponsable');
            }
            if (rellenar === 'yes') {
                updates.push(`economico = '${economicoRellenar}'`);
            }
            if (updates.length === 0) {
                res.status(400).json({ message: 'No hay datos para actualizar' });
                return;
            }

            const numeroE = await Neconomico(id);


            transaction = new sql.Transaction();
            await transaction.begin();

            const request = new sql.Request(transaction);

            const query = `UPDATE sucursales SET ${updates.join(', ')} WHERE economico = '${numeroE}'`;

            request.input('economico', sql.VarChar, economico);
            request.input('canal', sql.VarChar, canal);
            request.input('nombre', sql.VarChar, nombre);
            request.input('ingresponsable', sql.VarChar, ingresponsable);

            if (economico.length === 0) {
                await request.query(query);
            }
            if (economico.length !== 0) {

                await request.query('ALTER TABLE dispositivos NOCHECK CONSTRAINT fk_economico');
                await request.query('ALTER TABLE mantenimiento NOCHECK CONSTRAINT FK_mantenimiento_sucursales');
                await request.query(query);
                await request.query(`UPDATE dispositivos SET economico = '${economico}' FROM dispositivos WHERE economico = '${numeroE}'`);
                await request.query(`UPDATE mantenimiento SET economico = '${economico}' FROM mantenimiento WHERE economico = '${numeroE}'`);
                await request.query('ALTER TABLE mantenimiento CHECK CONSTRAINT FK_mantenimiento_sucursales');
                await request.query('ALTER TABLE dispositivos CHECK CONSTRAINT fk_economico');
            }

            await transaction.commit();

            if (rellenar === 'yes') {
                const request = new sql.Request();
                const disposTodos = (await sql.query(`SELECT dispo.nombre from dispositivos dispo INNER JOIN sucursales sucu ON sucu.economico = dispo.economico GROUP BY dispo.nombre`)).recordset;
                const disposTiene = (await sql.query(`SELECT dispo.nombre from dispositivos dispo INNER JOIN sucursales sucu ON sucu.economico = dispo.economico WHERE sucu.economico = '${economicoRellenar}' GROUP BY dispo.nombre`)).recordset;
                function disposNoTiene(Todos, Tiene) {
                    return Todos.filter(obj1 =>
                        !Tiene.some(obj2 => obj2.nombre === obj1.nombre)
                    );
                }
                const disposFaltantes = disposNoTiene(disposTodos, disposTiene);
                for (let i = 0; i < disposFaltantes.length; i++) {
                    let ip = `000.${obtenerNumeroAleatorio()}.${obtenerNumeroAleatorio()}.${obtenerNumeroAleatorio()}`

                    await request.query(`INSERT INTO dispositivos ([ip],[economico],[nombre]) VALUES ('${ip}','${economicoRellenar}','${disposFaltantes[i].nombre}')`)
                }
            }
            res.status(200).json({ message: 'Sucursal actualizado exitosamente' });

        } catch (error) {
            if (transaction) {
                try {

                    await transaction.rollback();
                } catch (rollbackError) {
                    console.error('Error al revertir la transacción:', rollbackError);
                }
            }
            console.error('Error actualizando datos:', error);
            res.status(500).json({ message: 'Error actualizando datos' });
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

const deleteSucursal = async (req, res) => {
    if (req.session.admin) {
        let transaction;
        try {

            await dbConnection();

            const { id } = req.body;

            const IdExiste = await comprobarID(id);
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontró el ID' });
                return;
            }

            const numeroE = await Neconomico(id);


            transaction = new sql.Transaction();
            await transaction.begin();

            const request = new sql.Request(transaction);

            await request.query('ALTER TABLE dispositivos NOCHECK CONSTRAINT fk_economico');
            await request.query('ALTER TABLE mantenimiento NOCHECK CONSTRAINT FK_mantenimiento_sucursales');
            await request.query(`DELETE FROM sucursales WHERE economico = '${numeroE}'`);
            await request.query(`DELETE FROM mantenimiento WHERE economico = '${numeroE}'`);
            await request.query(`UPDATE dispositivos SET economico = '000000' FROM dispositivos WHERE economico = ${numeroE}`);
            await request.query('ALTER TABLE mantenimiento CHECK CONSTRAINT FK_mantenimiento_sucursales');
            await request.query('ALTER TABLE dispositivos CHECK CONSTRAINT fk_economico');


            await transaction.commit();

            res.status(200).json({ message: 'Sucursal eliminada exitosamente' });

        } catch (error) {
            if (transaction) {
                try {

                    await transaction.rollback();
                } catch (rollbackError) {
                    console.error('Error al revertir la transacción:', rollbackError);
                }
            }
            res.status(500).json({ message: 'Error eliminando datos' });
            console.error('Error eliminando datos:', error);

        } finally {
            try {
                await sql.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    } else {
        res.redirect('');
    }
}

export const methods = {
    getSucursales,
    postSucursal,
    patchSucursal,
    deleteSucursal
}