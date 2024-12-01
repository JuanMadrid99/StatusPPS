import React, { useState } from 'react';
import axios from '../../api/axiosConfig'; 

const DeleteApps = () => {
    const [formData, setFormData] = useState({
        id: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const cambio = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const Eliminar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST}/apps/dispositivos/eliminar`, formData);
            setMessage(response.data.message || 'Dispositivo eliminado exitosamente');
            window.location.reload(); 
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al eliminar el dispositivo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='caja eliminar'>
                <h5>Eliminar</h5>
                <form onSubmit={Eliminar}>
                    <div className="delete">
                        <label htmlFor="id"><span className='ReEliminar'>*</span>ID:</label>
                        <input type="number" id="id" name="id" maxLength="5" placeholder='Elemento que eliminara' title='ID' min='1' pattern='\d{1,5}' required onChange={cambio} value={formData.id}/>
                        <button type="submit" disabled={loading}>Eliminar</button>
                    </div>
                </form>
                <div className='avisos'>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </>
    );
};

export default DeleteApps;

