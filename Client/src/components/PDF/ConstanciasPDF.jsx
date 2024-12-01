import React, { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Toaster, toast } from 'react-hot-toast';
import '../css/PDF.css'

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function PDFConstancias({ images, title = 'Reporte de Mantenimiento', eco }) {
    const [imageData, setImageData] = useState([]);

    const convertBufferToGrayscale = (buffer) => {
        return new Promise((resolve, reject) => {
            try {
                const uint8Array = new Uint8Array(buffer);  
                const blob = new Blob([uint8Array], { type: 'image/jpeg' });  
                const reader = new FileReader();

                reader.onloadend = () => {
                    const img = new Image();
                    img.src = reader.result;

                    img.onload = () => {
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

                    img.onerror = reject;
                };

                reader.onerror = reject;
                reader.readAsDataURL(blob);  
            } catch (error) {
                reject(error);  
            }
        });
    };

    
    useEffect(() => {
        if (images.length > 0) {
            Promise.all(
                images.map((image) => {
                    
                    if (image && image.data) {
                        return convertBufferToGrayscale(image.data); 
                    }
                    return null; 
                })
            )
                .then((base64Images) => {
                    
                    const validImages = base64Images.filter((image) => image !== null);
                    setImageData(validImages); 
                })
                .catch((error) => {
                    console.error("Error al convertir las imágenes:", error);
                    toast.error("Hubo un error al procesar las imágenes.");
                });
        }
    }, [images]);

    
    const downloadPDF = () => {
        if (imageData.length === 0) {
            toast.error('No se pudieron procesar las constancias. Intente nuevamente.');
            return;
        }

        const docDefinition = {
            pageSize: { width: 612, height: 792 }, 
            pageMargins: [0, 0, 0, 0], 
            content: imageData.map((image, index) => ({
                image, 
                width: 612, 
                height: 792, 
                alignment: 'center',
                pageBreak: index < imageData.length - 1 ? 'after' : undefined, 
            })),
        };

        const filename = `${title.replace(/\s+/g, '_')}_${eco}.pdf`; 
        pdfMake.createPdf(docDefinition).download(filename); 
        toast.success('Constancias PDF', { position: 'bottom-right' });
    };

    return (
        <>
            <button onClick={downloadPDF} className="pdfAll">Guardar Constancias</button>

            <Toaster />
        </>
    );
}
