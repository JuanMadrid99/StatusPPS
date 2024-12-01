import ping from 'ping';

/**
 * Función para hacer ping a un host.
 * @param {string} host - La dirección IP o hostname del dispositivo.
 * @returns {Promise<object>} - Un objeto con el resultado del ping.
 */
const pingHost = async (host) => {
    let silbido = ''
    try {
        const res = await ping.promise.probe(host);
        let vivo = res.alive;
        silbido = vivo;
    } catch (error) {
        silbido = `Error al hacer ping a: ${host}`;
    }
    return {
        silbido
    };
};

export default pingHost;