import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Toaster, toast } from 'react-hot-toast';
import date from '../../utils/date.js'
import imgBase64 from '../../utils/imgBase64.js'
import '../css/PDF.css'
import logo from '../../imgs/LogoSoporteBN.png';
import hn from '../../imgs/hnBN.png';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function ALLPDF(props) {

    const user = useContext(UserContext);
    const fecha = date();

    const downloadPDF = async () => {

        const logoBase64 = await imgBase64(logo);
        const hnBase64 = await imgBase64(hn);

        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [30, 20, 30, 40],


            content: props.data.flatMap((item, index) => [
                {
                    columns: [
                        { image: logoBase64, width: 25, margin: [0, 10, 0, 0], alignment: 'left' },
                        { text: 'Soporte Técnico Honduras', style: 'header', width: '*', alignment: 'center' },
                        { image: hnBase64, width: 40, margin: [0, 10, 5, 0], alignment: 'right' },
                    ],
                    margin: [0, 0, 0, 4]
                },
                { text: `${(user.id === 4) ? `Ing. ${user.username}` : ''}`, style: 'subheader' },
                { text: `${(user.id !== 4) ? `Ingeniero responsable: ${item.ingresponsable}` : ''}`, style: 'subheader' },
                { text: `${item.economico || 'N/A'} ${item.sucursal || 'Económico un Dispositivo'}`, style: 'subheader' },
                { text: `${item.nombre || 'Nombre del dispositivo'} ${item.ip.startsWith('000.') ? 'Sin inventario' : item.ip.startsWith('001.') ? 'No aplica' : item.ip}`, style: 'subheader' },
                { text: item.descripcion || 'Descripción del dispositivo.', style: 'text' },
                { text: 'Información General', style: 'sectionHeader' },
                { text: item.general || 'Información General.', style: 'text' },
                {
                    columns: [
                        { text: `Tipo de Reporte: ${props.titulo}`, style: 'footer1' },
                        { text: `Fecha de Generación: ${fecha}`, style: 'footer2' },
                    ],
                    margin: [0, 0, 0, 20]
                },
                { text: '', pageBreak: 'after' }
            ]),
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    margin: [0, 10, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                sectionHeader: {
                    fontSize: 12,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                text: {
                    fontSize: 12,
                    margin: [0, 0, 0, 10]
                },
                footer1: {
                    fontSize: 10,
                    margin: [0, 10, 0, 0],
                    alignment: 'left'
                },
                footer2: {
                    fontSize: 10,
                    margin: [0, 10, 0, 0],
                    alignment: 'right'
                }
            },
        };
        /* 20172000761 */
        let tostada = `No hay información`
        let guardado = `reporte.pdf`
        if (props.guardado === 'apps' && props.data.length !== 0) {
            guardado = `${props.data[0].economico || ' '}-Dispositivos.pdf`;
            tostada = `Dispositivos de ${props.data[0].economico || ' '}`
        }
        else if (props.guardado === 'devices' && props.data.length !== 0) {
            guardado = `${props.data[0].nombre || ' '}-Sucursales.pdf`;
            tostada = `Sucursales con ${props.data[0].nombre || ' '}`
        }
        pdfMake.createPdf(docDefinition).download(guardado);
        toast(tostada, { position: 'bottom-right' });
    }

    return (
        <>
            {props && props.data.length !== 0 && (
                <>
                    <button className='pdfAll' onClick={downloadPDF} type="button">{props.titulo}</button>
                </>
            )}
            <Toaster />
        </>
    );
}
