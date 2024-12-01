import React, { useState, useEffect } from 'react';
import fetchData from '../../api/connect.js'; 
import { Paginador } from '../Elements/Paginador.jsx';

const SelectMantenimientos = () => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/panel/mantenimientos`;
        const sucursales = async () => {
            try {
                const response = await fetchData(url);
                const mantenimientos = await response.json();
                setData(mantenimientos);
                setCount(mantenimientos.length)
            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        sucursales();
    }, []);

    const eleccion = async (economico) => {
        let url = `http://${process.env.REACT_APP_HOST}/mantes/numero/${economico}`;
        try {
            const response = await fetchData(url)
            if (!response.ok) {
                throw new Error('Sin respuesta')
            }
        } catch (error) {
            console.error('Error consiguiendo los datos: ', error);
        }
    }

    return (
        <>
            <Paginador tipo='mantenimientos' titulo='MANTENIMIENTOS' placeholder='Buscar por Número económico, ing. Responsable o Fechas' data={data} excel='si' save='Mantenimientos' cantidad={count} eleccion={eleccion}/>
        </>
    );
};

export default SelectMantenimientos;