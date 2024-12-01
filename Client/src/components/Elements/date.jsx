import React from 'react';

const FormatearFecha = ({ fecha }) => {        
    const date = new Date(fecha);
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dd = date.getUTCDate(); 
    const mm = meses[date.getUTCMonth()]; 
    const yy = date.getUTCFullYear(); 

    const fechaFormateada = `${dd}/${mm}/${yy}`;

    return (
        <span>{fechaFormateada}</span>
    );
};

export default FormatearFecha;
