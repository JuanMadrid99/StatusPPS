import React, { useState, useEffect } from 'react';
import fetchData from '../../api/connect.js';
import { Paginador } from '../Elements/Paginador.jsx';

const SelectManuales = () => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/panel/manuales`;
        const sucursales = async () => {
            try {
                const response = await fetchData(url);
                const manuales = await response.json();
                setData(manuales);
                setCount(manuales.length)
            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        sucursales();
    }, []);

    const eleccion = async (id, nombre = 'Manual') => {
        let urle = `http://${process.env.REACT_APP_HOST}/panel/manual/${id}`;
        try {
            const response = await fetchData(urle)
            if (!response.ok) {
                throw new Error('Sin respuesta')
            }
            const ManualBlob = await response.blob();
            const blob = new Blob([ManualBlob], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${nombre}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);


        } catch (error) {
            console.error('Error consiguiendo los datos: ', error);
        }
    }
    const ver = async (id) => {
        let url = `http://${process.env.REACT_APP_HOST}/manuales/vermanual/${id}`;
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
            <Paginador tipo='manuales' titulo='MANUALES' placeholder='Buscar por Nombre o Descripción' data={data} save='Manual' cantidad={count} eleccion={eleccion} ver={ver} />
        </>
    );
};

export default SelectManuales;