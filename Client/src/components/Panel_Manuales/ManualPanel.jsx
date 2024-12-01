import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import PostManual from './PostManuales';
import DeleteManuales from './DeleteManual';
import UpdateManuales from './UpdateManual';
import './../css/panel.css';

const ManualPanel = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1) && (
                <div className='cajamadre'>
                    <h3>Administración</h3>
                    <div className='cajahija'>
                        <PostManual />
                        <UpdateManuales />
                        <DeleteManuales />
                    </div>
                </div>
            )}
        </>
    );
};

export default ManualPanel;