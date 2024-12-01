import React, { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Toaster, toast } from 'react-hot-toast';
import '../css/PDF.css'


pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function PDFConstancia({ imageBlob, eco, title = 'Reporte de Mantenimiento', fechaco }) {
    const [imageData, setImageData] = useState(null);

    function formatearFecha(fechaISO) {
        
        const fechaSolo = fechaISO.split('T')[0]; 
        return `${fechaSolo}`;
    }
    const fechacons = formatearFecha(fechaco);

    
    const convertImageToGrayscale = (imageBlob) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onloadend = function () {
                img.src = reader.result;
            };

            reader.onerror = reject;
            reader.readAsDataURL(imageBlob);

            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                for (let i = 0; i < pixels.length; i += 4) {
                    const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3; 
                    pixels[i] = avg; 
                    pixels[i + 1] = avg; 
                    pixels[i + 2] = avg; 
                }

                
                ctx.putImageData(imageData, 0, 0);

                
                const grayscaleBase64 = canvas.toDataURL();
                resolve(grayscaleBase64);
            };
        });
    };

    
    useEffect(() => {
        if (imageBlob) {
            convertImageToGrayscale(imageBlob).then((grayscaleImage) => {
                setImageData(grayscaleImage); 
            }).catch(error => console.error("Error al convertir la imagen:", error));
        }
    }, [imageBlob]);

    
    const downloadPDF = () => {
        if (!imageData) {
            alert('No se pudo procesar la constancia. Intente nuevamente.');
            return;
        }

        const docDefinition = {
            pageSize: { width: 612, height: 792 }, 
            pageMargins: [0, 0, 0, 0], 
            content: [
                {
                    image: imageData, 
                    width: 612, 
                    height: 792, 
                    alignment: 'center'
                },
            ],
        };

        const filename = `${title.replace(/\s+/g, '_')}_${eco}_${fechacons}.pdf`; 
        pdfMake.createPdf(docDefinition).download(filename); 
        toast(`Mantenimiento PDF ${fechacons}`, { position: 'bottom-right' });
    };

    return (
        <>
            <button onClick={downloadPDF} className="pdfSelected">Guardar Documento</button>
            <Toaster />
        </>
    );
}
