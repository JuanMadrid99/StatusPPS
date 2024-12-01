import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import '../css/PDF.css'

const JPGConstancia = ({ imageBlob, eco, fechaco }) => {

    function formatearFecha(fechaISO) {
        const fechaSolo = fechaISO.split('T')[0]; 
        return `${fechaSolo}`;
    }
    const fechacons = formatearFecha(fechaco);
    
    const handleDownload = () => {
        if (imageBlob) {
            const url = URL.createObjectURL(imageBlob); 
            const a = document.createElement('a'); 
            a.href = url; 
            a.download = `Constancia_${eco}_${fechacons}.jpg`; 
            a.click(); 
            URL.revokeObjectURL(url); 
            toast(`Constancia ${fechacons}`, { position: 'bottom-right' });
        }
    };

    return (
        <div>
            <button onClick={handleDownload} className="pdfSelected" style={{ right: '70%' }}>
                Guardar Imagen
            </button>

            <Toaster />
        </div>

    );
};

export default JPGConstancia;
