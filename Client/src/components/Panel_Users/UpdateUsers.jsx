import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';

const UpdateUsers = ({ userId }) => {
    const [formData, setFormData] = useState({
        id: '',
        nickname: '',
        psw: '',
        tipo: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://${process.env.REACT_APP_HOST}/panel/users/${userId}`);
                const user = response.data;
                setFormData({
                    id: user.id,
                    nickname: user.nickname,
                    psw: user.psw,
                    isAdmin: user.admin ? 'true' : 'false'
                });
            } catch (error) {
                setMessage('Error al cargar los datos del usuario');
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const cambio = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'radio' ? value : type === 'checkbox' ? checked : value
        }));
    };

    const actualizar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/users/actualizar`, formData);
            setMessage(response.data.message || 'Usuario actualizado exitosamente');
            window.location.reload();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al actualizar el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='caja actualizar'>
                <h5>Actualizar</h5>
                <form onSubmit={actualizar}>
                    <label htmlFor="nickname">Nombre:</label>
                    <input type="text" id="nickname" name="nickname" maxLength="50" placeholder='Nombre del Usuario (Opcional)' title="Nombre del Usuario (Opcional)" value={formData.nickname} onChange={cambio} />
                    <label htmlFor="psw">Contraseña:</label>
                    <input type="text" id="psw" name="psw" maxLength="50" placeholder='Contraseña del Usuario (Opcional)' title='Contraseña del Usuario (Opcional)' value={formData.psw} onChange={cambio} />
                    <label htmlFor="usuarios">Usuario:</label>
                    <select id="usuarios" name="tipo" className='usuarios' title='Tipo de Usuario' value={formData.tipo} onChange={cambio}>
                        <option value="" className='tipousuario'>Seleccione: (Opcional)</option>
                        <option value="Geografia" >Geografía</option>
                        <option value="Aplicativo" >Aplicativo</option>
                        <option value="Administrador" >Administrador</option>
                    </select>
                    <div className='update'>
                        <label htmlFor="id"><span className='ReActualizar'>*</span>ID:</label>
                        <input type="text" id="id" name="id" maxLength="5" required placeholder='Elemento que actualizará' title="Elemento que actualizará" value={formData.id} onChange={cambio} />
                        <button type="submit" disabled={loading}>Actualizar</button>
                    </div>
                </form >
                <div className='avisos'>
                    {message && <p>{message}</p>}
                </div>
            </div >
        </>
    );
};

export default UpdateUsers;
