import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import PostConstancia from './PostConstancia';
import './../css/panel.css';

const ConstanciaPanel = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 4) && (
                <div className='cajamadre'>
                    <h3>Mantenimiento</h3>
                    <div className='cajahija'>
                        <PostConstancia />
                    </div>
                </div>
            )}
        </>
    );
};

export default ConstanciaPanel;