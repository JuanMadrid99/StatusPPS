import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/navbar.css';
import axios from '../../api/axiosConfig'; 

export default function Navbar() {
    const user = useContext(UserContext);

    const navigate = useNavigate();

    const Logout = async (e) => { 
        e.preventDefault(); 

        try {
            await axios.post(`http://${process.env.REACT_APP_HOST}/out`, {
            });
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };
    return (
        <div className='navbar'>
            {user && user.id === 0 && ( 
                <>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to='/'>
                            Iniciar Sesión
                        </NavLink>
                    </li>
                </>
            )}
            {user && (user.id === 1 || user.id === 2) && ( 
                <>
                    <li className='usuario'>
                        {user.username}
                    </li>

                    {user && user.id === 1 && (
                        <li>
                            <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/panusers">
                                Usuarios
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/pansucursal">
                            Sucursales
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/panapps">
                            Dispositivos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/panmantenimiento">
                            Mantenimientos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/panmanuales">
                            Manuales
                        </NavLink>
                    </li>
                    <li className='tipo'>
                        {user.tipo}
                    </li>
                    <li>
                        <a href="/" className='close' onClick={Logout}>
                            Cerrar Sesión
                        </a>
                    </li>
                </>
            )}
            {user && (user.id === 3 || user.id === 4) && (
                <>
                    <li className='usuario'>
                        {user.username}
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/sucursales">
                            Sucursales
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/aplicaciones">
                            Dispositivos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/mantenimientos">
                            Mantenimientos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/panmanuales">
                            Manuales
                        </NavLink>
                    </li>
                    <li className='tipo'>
                        {user.tipo}
                    </li>
                    <li>
                        <a href="/" onClick={Logout} className='close'>
                            Cerrar Sesión
                        </a>
                    </li>
                </>
            )}

        </div>
    );
}
