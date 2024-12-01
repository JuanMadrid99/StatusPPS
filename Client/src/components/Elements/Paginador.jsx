import React, { useState, useContext } from 'react';
import FormatearFecha from './date.jsx';
import fetchData from '../../api/connect.js';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ListExcel } from '../Listas/Lista_Excel.jsx';
import { ListPDF } from '../Listas/Lista_PDF.jsx';
import { UserContext } from '../../context/UserContext';
import ReactPaginate from 'react-paginate';
import { FaEject, FaToolbox, FaCaretLeft, FaCaretRight } from "react-icons/fa"
import { HiStatusOnline, HiExternalLink, HiDocumentDownload, HiEye } from "react-icons/hi"
import logo from '../../imgs/LogoSoporte.png'
import hn from '../../imgs/hn.png'
import '../css/tabla.css';

const Paginador = (props) => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [PaginaActual, setPaginaActual] = useState(0);
    const [Busqueda, setBusqueda] = useState('');
    const itemsPorPagina = 12;

    const busquedaCambios = (e) => {
        setBusqueda(e.target.value);
        setPaginaActual(0);
    };

    function formatearFecha(fechaISO) {

        const fechaSolo = fechaISO.split('T')[0];
        return `${fechaSolo}`;
    }

    function formatearFechaCons(fechaISO) {

        let fechaSolo = fechaISO.split('T')[0];
        fechaSolo = `${fechaSolo}`;
        let [yy, mm, dd] = fechaSolo.split('-');
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        mm = parseInt(mm);
        mm = meses[mm - 1]
        let fechacons = `${dd}/${mm}/${yy}`
        return fechacons;
    }


    const filtrarDatos = props.data.filter(item => {
        if (props.tipo === 'usuarios') {
            const nickname = item.nickname ? item.nickname.toString().toLowerCase() : '';
            const tipo = item.tipo ? item.tipo.toString().toLowerCase() : '';
            return (
                nickname.includes(Busqueda.toLowerCase()) || tipo.includes(Busqueda.toLowerCase())
            );
        }
        else if (props.tipo === 'sucursales' || props.tipo === 'sucursal') {
            const economico = item.economico ? item.economico.toString().toLowerCase() : '';
            const canal = item.canal ? item.canal.toString().toLowerCase() : '';
            const nombre = item.nombre ? item.nombre.toString().toLowerCase() : '';
            const ingresponsable = item.ingresponsable ? item.ingresponsable.toString().toLowerCase() : '';
            return (
                canal.includes(Busqueda.toLowerCase()) || nombre.includes(Busqueda.toLowerCase()) || economico.includes(Busqueda.toLowerCase()) || ingresponsable.includes(Busqueda.toLowerCase())
            );
        }        /* 20172000761 */
        else if (props.tipo === 'dispositivos' || props.tipo === 'aplicacion') {
            if (item.ip.startsWith('000.')) {
                item.ip = 'Sin inventario'
            }
            if (item.ip.startsWith('001.')) {
                item.ip = 'No aplica'
            }
            const dispositivo = item.dispositivo ? item.dispositivo.toString().toLowerCase() : '';
            const ip = item.ip ? item.ip.toString().toLowerCase() : '';
            const economico = item.economico ? item.economico.toString().toLowerCase() : '';
            const canal = item.canal ? item.canal.toString().toLowerCase() : '';
            const sucursal = item.sucursal ? item.sucursal.toString().toLowerCase() : '';
            const ingresponsable = item.ingresponsable ? item.ingresponsable.toString().toLowerCase() : '';
            return (
                canal.includes(Busqueda.toLowerCase()) || sucursal.includes(Busqueda.toLowerCase()) || economico.includes(Busqueda.toLowerCase()) || ip.includes(Busqueda.toLowerCase()) || dispositivo.includes(Busqueda.toLowerCase()) || ingresponsable.includes(Busqueda.toLowerCase())
            );
        }
        else if (props.tipo === 'mantenimientos' || props.tipo === 'mantenimiento') {
            let festimada = '';
            let frealizada = '';

            if (item.frealizada === null || item.frealizada === 'null') {
                item.frealizada = 'Pendiente'
            }
            else {
                item.frealizada = formatearFecha(`${item.frealizada}`)
            }
            item.festimada = formatearFecha(`${item.festimada}`)

            festimada = item.festimada ? formatearFechaCons(item.festimada) : '';
            frealizada = item.frealizada ? formatearFechaCons(item.frealizada) : '';
            const economico = item.economico ? item.economico.toString().toLowerCase() : '';
            const canal = item.canal ? item.canal.toString().toLowerCase() : '';
            const nombre = item.nombre ? item.nombre.toString().toLowerCase() : '';
            const ingresponsable = item.ingresponsable ? item.ingresponsable.toString().toLowerCase() : '';
            return (
                frealizada.includes(Busqueda) || festimada.includes(Busqueda) || canal.includes(Busqueda.toLowerCase()) || nombre.includes(Busqueda.toLowerCase()) || economico.includes(Busqueda.toLowerCase()) || ingresponsable.includes(Busqueda.toLowerCase())
            );
        }
        else if (props.tipo === 'manuales') {
            const nombre = item.nombre ? item.nombre.toString().toLowerCase() : '';
            const descripcion = item.descripcion ? item.descripcion.toString().toLowerCase() : '';
            return (
                nombre.includes(Busqueda.toLowerCase()) || descripcion.includes(Busqueda.toLowerCase())
            );
        }
        return false;
    });

    const cantidadPaginas = Math.ceil(filtrarDatos.length / itemsPorPagina);


    const click = (selectedPage) => {
        setPaginaActual(selectedPage.selected);
    };

    const desplazamiento = PaginaActual * itemsPorPagina;
    const itemsActuales = filtrarDatos.slice(desplazamiento, desplazamiento + itemsPorPagina);


    const ping = async (ip) => {
        toast.promise(
            fetchData(`http://${process.env.REACT_APP_HOST}/apps/ping/${ip}`).then(async (response) => {
                if (!response.ok) {
                    throw new Error('Sin respuesta');
                }
                const silbato = await response.json();
                return silbato.silbido;
            }),
            {
                loading: 'Cargando ping...',
                success: (data) => {
                    if (data) {
                        return <b style={{ color: 'green', fontSize: '25px' }}>Se logró la conexión</b>;
                    } else {
                        return <b style={{ color: 'red', fontSize: '25px' }}>No hay conexión</b>;
                    }
                },
                error: () => {
                    return <b>Sin información, ocurrió un error!</b>;
                },
            },
            {
                style: {
                    minWidth: '250px',
                    maxWidth: '250px',
                    minHeight: '25px',
                    maxHeight: '25px',
                },
                success: {
                    duration: 5000,
                    icon: null,
                },
            }
        );
    }

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
            <div className='cajapadre'>
                <div className='encabezados'>
                    <img className='logos' src={logo} alt="logo de S.O.S." />
                    <h3 className='titular'>{props.titulo}</h3>
                    <img className='logos' src={hn} alt="Bandera de Honduras" />
                </div>
                <input className='buscar' type="text" maxLength='50' placeholder={props.placeholder} value={Busqueda} onChange={busquedaCambios} />
                <ReactPaginate
                    previousLabel={<FaCaretLeft className='flechas' />}
                    nextLabel={<FaCaretRight className='flechas' />}
                    breakLabel={'...'}
                    pageCount={cantidadPaginas}
                    marginPagesDisplayed={6}
                    pageRangeDisplayed={3}
                    onPageChange={click}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />

                {user && (user.id === 3 || user.id === 4) && props.tipo === 'sucursal' && (
                    <>
                        <div className='cajahijo'>
                            <table className='tablaData'>
                                <thead>
                                    <tr>
                                        <th className='thData eject'><FaEject /></th>
                                        <th className='thData eject'><FaToolbox /></th>
                                        <th className='thData'>Económico</th>
                                        <th className='sunombre thData'>Canal</th>
                                        <th className='sunombre thData'>Nombre</th>
                                        {user && user.id === 3 && (
                                            <th className='thData'>Ing. Responsable</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody >
                                    {itemsActuales.map(item => (
                                        <>
                                            {!item.economico.startsWith('000000') && (
                                                <tr key={item.id}>
                                                    <td className='tdData'><a href='/status' onClick={() => { props.eleccion(item.economico) }} className='link select'><button className='ir'></button></a></td>
                                                    <td className='tdData'><a href='/mantes' onClick={() => { eleccion(item.economico) }} className='link select'><button className='ir'></button></a></td>
                                                    <td className='tdData'>{item.economico}</td>
                                                    <td className='sunombre tdData'>{item.canal}</td>
                                                    <td className='sunombre tdData'>{item.nombre}</td>
                                                    {user && user.id === 3 && (
                                                        <td className='sunombre tdData'>{item.ingresponsable}</td>
                                                    )}
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                            <p className='cantidad'>Sucursales: {props.cantidad}</p>
                        </div>
                    </>
                )}

                {user && (user.id === 3 || user.id === 4) && props.tipo === 'aplicacion' && (
                    <>
                        <div className='cajahijo'>
                            <table className='tablaData'>
                                <thead>
                                    <tr>
                                        <th className='thData pingi'><HiStatusOnline /></th>
                                        <th className='thData pingi'><HiExternalLink /></th>
                                        <th className='thData'>Dispositivo</th>
                                        <th className='sunombre thData'>IP</th>
                                        <th className='thData'>Económico</th>
                                        <th className='thData'>Canal</th>
                                        <th className='sunombre thData'>Sucursal</th>
                                        {user && user.id === 3 && (
                                            <th className='thData'>Ing. Responsable</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody >
                                    {itemsActuales.map(item => (
                                        <tr key={item.id}>
                                            <td className='tdData'>
                                                {!item.ip.startsWith('Sin') && !item.ip.startsWith('No') && (
                                                    <button onClick={() => { ping(item.ip) }} className='ping'></button>
                                                )}
                                            </td>
                                            <td className='tdData'>
                                                {!item.ip.startsWith('Sin') && !item.ip.startsWith('No') && (
                                                    <a href={`https://${item.ip}`} target='_blank' rel="noreferrer" className='link select'><button className='ir'></button></a>
                                                )}
                                            </td>
                                            <td className='tdData'>{item.dispositivo}</td>
                                            <td className='tdData'>{item.ip}</td>
                                            <td className='tdData'>{item.economico}</td>
                                            <td className='tdData'>{item.canal}</td>
                                            <td className='tdData'>{item.sucursal}</td>
                                            {user && user.id === 3 && (
                                                <td className='tdData'>{item.ingresponsable}</td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table className='tablaLista'>
                                <thead>
                                    <tr>
                                        {props.listaDispositivos.map(item => (
                                            <>
                                                <th className='thLista' onClick={() => { props.eleccion(item.nombre); navigate('/devices'); }}>
                                                    <a href='/devices' onClick={() => { props.eleccion(item.nombre) }} className='linklista'>{item.nombre}</a>
                                                </th>
                                            </>
                                        ))}
                                    </tr>
                                </thead>
                            </table>
                            <p className='cantidad'>Dispositivos: {props.cantidad}</p>
                        </div>
                    </>
                )}

                {user && (user.id === 3 || user.id === 4) && props.tipo === 'mantenimiento' && (
                    <>
                        <div className='cajahijo'>
                            <table className='tablaData'>
                                <thead>
                                    <tr>
                                        <th className='thData eject'><FaToolbox /></th>
                                        <th className='thData'>Económico</th>
                                        {user && user.id === 3 && (
                                            <th className='thData'>Ing. Responsable</th>
                                        )}
                                        <th className='thData'>Fecha Estimada</th>
                                        <th className='thData'>Fecha Realizado</th>
                                        <th className='thData'>Descripción</th>
                                        <th className='thData'>ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsActuales.map(item => (
                                        <>
                                            {!item.economico.startsWith('000000') && (
                                                <tr key={item.id}>
                                                    <td className='tdData'><a href='/mantes' onClick={() => { props.eleccion(item.economico) }} className='link select'><button className='ir'></button></a></td>
                                                    <td className='tdData'>{item.economico}</td>
                                                    {user && user.id === 3 && (
                                                        <td className='tdData'>{item.ingresponsable}</td>
                                                    )}
                                                    <td className='tdData'><FormatearFecha fecha={item.festimada} /></td>
                                                    <td className='tdData'>
                                                        {(item.frealizada && item.frealizada !== null && item.frealizada !== 'null' && item.frealizada !== 'Pendiente') && (
                                                            <FormatearFecha fecha={item.frealizada} />
                                                        )}
                                                        {(!item.frealizada || item.frealizada === null || item.frealizada === 'null' || item.frealizada === 'Pendiente') && (
                                                            <span>Pendiente</span>
                                                        )}
                                                    </td>
                                                    <td className='tdData long-data'>{item.descripcion}</td>
                                                    <td className='tdData'>{item.id}</td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                            <p className='cantidad'>Mantenimientos: {props.cantidad}</p>
                        </div>
                    </>
                )}
                {user && props.tipo === 'manuales' && (
                    <>
                        <div className='cajahijo'>
                            <table className='tablaData'>
                                <thead>
                                    <tr>
                                        <th className='thData eject' style={{ fontSize: '1.3rem' }}><HiDocumentDownload /></th>
                                        <th className='thData eject' style={{ fontSize: '1.3rem' }}><HiEye /></th>
                                        <th className='thData'>Nombre</th>
                                        <th className='thData'>Descripción</th>
                                        <th className='thData'>ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsActuales.map(item => (
                                        <tr key={item.id}>
                                            <td className='tdData'><button onClick={() => { props.eleccion(item.id, item.nombre) }} className='circuloir' ></button></td>
                                            <td className='tdData'><a href='manual' onClick={() => { props.ver(item.id) }} className='link select'><button className='ir'></button></a></td>
                                            <td className='tdData long-data' style={{ maxWidth: '45vw' }}>{item.nombre}</td>
                                            <td className='tdData long-data' style={{ maxWidth: '45vw' }}>{item.descripcion}</td>
                                            <td className='tdData'>{item.id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className='cantidad'>Manuales: {props.cantidad}</p>
                        </div>
                    </>
                )}
                {user && (user.id === 1 || user.id === 2) && props.tipo === 'usuarios' && (
                    <>
                        <div className='cajahijo'>
                            <table className='tablaData'>
                                <thead>
                                    <tr>
                                        <th className='thData'>Nombre</th>
                                        <th className='sunombre thData'>Contraseña</th>
                                        <th className='sunombre thData'>Usuario</th>
                                        <th className='thData'>ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsActuales.map(item => (
                                        <tr key={item.id}>
                                            <td className='tdData'>{item.nickname}</td>
                                            <td className='tdData long-data' style={{ overflowX: 'hidden' }}>{item.psw}</td>
                                            <td className='tdData'>{item.tipo}</td>
                                            <td className='tdData'>{item.id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className='cantidad'>Usuarios: {props.cantidad}</p>
                        </div>
                    </>
                )}

                {user && (user.id === 1 || user.id === 2) && props.tipo === 'sucursales' && (
                    <>
                        <div className='cajahijo'>
                            <table className='tablaData'>
                                <thead>
                                    <tr>
                                        <th className='thData eject'><FaEject /></th>
                                        <th className='thData eject'><FaToolbox /></th>
                                        <th className='thData'>Económico</th>
                                        <th className='thData'>Canal</th>
                                        <th className='sunombre thData'>Nombre</th>
                                        <th className='thData'>Ing.Responsable</th>
                                        <th className='thData'>ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsActuales.map(item => (
                                        <>
                                            {!item.economico.startsWith('000000') && (
                                                <tr key={item.id}>
                                                    <td className='tdData'><a href='/status' onClick={() => { props.eleccion(item.economico) }} className='link select'><button className='ir'></button></a></td>
                                                    <td className='tdData'><a href='/mantes' onClick={() => { eleccion(item.economico) }} className='link select'><button className='ir'></button></a></td>
                                                    <td className='tdData'>{item.economico}</td>
                                                    <td className='tdData'>{item.canal}</td>
                                                    <td className='tdData'>{item.nombre}</td>
                                                    <td className='tdData'>{item.ingresponsable}</td>
                                                    <td className='tdData'>{item.id}</td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                            <p className='cantidad'>Sucursales: {props.cantidad}</p>
                        </div>
                    </>
                )}

                {user && (user.id === 1 || user.id === 2) && props.tipo === 'dispositivos' && (
                    <>
                        <div className='cajahijo'>
                            <table className='tablaData'>
                                <thead>
                                    <tr>
                                        <th className='thData pingi'><HiStatusOnline /></th>
                                        <th className='thData pingi'><HiExternalLink /></th>
                                        <th className='thData'>Dispositivo</th>
                                        <th className='sunombre thData'>IP</th>
                                        <th className='thData'>Económico</th>
                                        <th className='thData'>Canal</th>
                                        <th className='sunombre thData'>Sucursal</th>
                                        <th className='thData'>ing.Responsable</th>
                                        <th className='thData'>ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsActuales.map(item => (
                                        <tr key={item.id}>
                                            <td className='tdData'>
                                                {!item.ip.startsWith('Sin') && !item.ip.startsWith('No') && (
                                                    <button onClick={() => { ping(item.ip) }} className='ping'></button>
                                                )}
                                            </td>
                                            <td className='tdData'>
                                                {!item.ip.startsWith('Sin') && !item.ip.startsWith('No') && (
                                                    <a href={`https://${item.ip}`} target='_blank' rel="noreferrer" className='link select'><button className='ir'></button></a>
                                                )}
                                            </td>
                                            <td className='tdData'>{item.dispositivo}</td>
                                            <td className='tdData'>{item.ip}</td>
                                            <td className='tdData'>{item.economico}</td>
                                            <td className='tdData'>{item.canal}</td>
                                            <td className='tdData'>{item.sucursal}</td>
                                            <td className='tdData'>{item.ingresponsable}</td>
                                            <td className='tdData'>{item.id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table className='tablaLista'>
                                <thead>
                                    <tr>
                                        {props.listaDispositivos.map(item => (
                                            <>
                                                <th className='thLista' onClick={() => { props.eleccion(item.nombre); navigate('/devices'); }}>
                                                    <a href='/devices' onClick={() => { props.eleccion(item.nombre) }} className='linklista'>{item.nombre}</a>
                                                </th>
                                            </>
                                        ))}
                                    </tr>
                                </thead>
                            </table>
                            <p className='cantidad'>Dispositivos: {props.cantidad}</p>
                        </div>
                    </>
                )}

                {user && (user.id === 1 || user.id === 2) && props.tipo === 'mantenimientos' && (
                    <>
                        <div className='cajahijo'>
                            <table className='tablaData'>
                                <thead>
                                    <tr>
                                        <th className='thData eject'><FaToolbox /></th>
                                        <th className='thData'>Económico</th>
                                        <th className='thData'>Ing. Responsable</th>
                                        <th className='thData'>Fecha Estimada</th>
                                        <th className='thData'>Fecha Realizado</th>
                                        <th className='thData'>Descripción</th>
                                        <th className='thData'>ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsActuales.map(item => (
                                        <>
                                            {!item.economico.startsWith('000000') && (
                                                <tr key={item.id}>
                                                    <td className='tdData'><a href='/mantes' onClick={() => { props.eleccion(item.economico) }} className='link select'><button className='ir'></button></a></td>
                                                    <td className='tdData'>{item.economico}</td>
                                                    <td className='tdData'>{item.ingresponsable}</td>
                                                    <td className='tdData'><FormatearFecha fecha={item.festimada} /></td>
                                                    <td className='tdData'>
                                                        {(item.frealizada && item.frealizada !== null && item.frealizada !== 'null' && item.frealizada !== 'Pendiente') && (
                                                            <FormatearFecha fecha={item.frealizada} />
                                                        )}
                                                        {(!item.frealizada || item.frealizada === null || item.frealizada === 'null' || item.frealizada === 'Pendiente') && (
                                                            <span>Pendiente</span>
                                                        )}
                                                    </td>
                                                    <td className='tdData long-data'>{item.descripcion}</td>
                                                    <td className='tdData'>{item.id}</td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                            <p className='cantidad'>Mantenimientos: {props.cantidad}</p>
                        </div>
                    </>
                )}
                {user && props.excel === 'si' && (
                    <>
                        <div className='saves'>
                            <div className='save'>
                                <ListExcel save={props.save} data={props.data} titulo='Guardar Excel' />
                            </div>
                            <div className='save'>
                                <ListPDF save={props.save} data={props.data} cantidad={props.cantidad} titulo='Guardar PDF' />
                            </div>
                        </div>
                    </>
                )}
            </div >
            <Toaster />
        </>
    );
}

export { Paginador };