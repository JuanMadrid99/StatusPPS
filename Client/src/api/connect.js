const fetchData = async (url) => {
    try {
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) {
            throw new Error('Sin respuesta');
        }
        console.log("Creado por Juan Madrid, 2024.");
        return response;

    } catch (error) {
        console.error('Error consiguiendo los datos: ', error.message);
    }
};
export default fetchData; 