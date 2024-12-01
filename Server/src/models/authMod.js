
import dbConnection from '../db/connection.js';
import bcrypt from 'bcryptjs';
import sql from 'mssql';

async function comprobarUsuario(nickname, psw) {
    try {
        await dbConnection();

        const query = 'SELECT nickname, psw, isAdmin, tipo FROM users WHERE nickname = @nickname';
        const request = new sql.Request();
        request.input('nickname', sql.VarChar, nickname);
        const resultado = await request.query(query);

        if (resultado.recordset.length > 0) {
            const usuario = resultado.recordset[0].nickname;
            const admon = resultado.recordset[0].isAdmin;
            const tipo = resultado.recordset[0].tipo;
            const hashAlmacenado = resultado.recordset[0].psw;

        
            const valid = await new Promise((resolve, reject) => {
                bcrypt.compare(psw.trim(), hashAlmacenado, (error, valid) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(valid);
                    }
                });
            });

            if (valid) {
                console.log("Las contraseñas coinciden.");
                return { usuario, admon, tipo };
            } else {
                console.log("Las contraseñas no coinciden.");
                return { usuario: null, admon: null, tipo: null };
            }
        } else {
            console.log("El usuario no existe");
            return { usuario: null, admon: null, tipo: null };
        }
    } catch (error) {
        console.error('Error al comprobar usuario:', error);
        throw error;
    } finally {
        try {
            await sql.close();
        } catch (closeError) {
            console.error('Error al cerrar la conexión:', closeError);
        }
    }
}


export { comprobarUsuario };