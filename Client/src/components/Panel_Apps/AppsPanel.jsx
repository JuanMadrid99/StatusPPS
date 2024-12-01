import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import PostApps from "./PostApps";
import UpdateApps from "./UpdateApps";
import DeleteApps from "./DeleteApps";
import './../css/panel.css';

const AppsPanel = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1 || user.id === 2) && (
                <div className='cajamadre'>
                    <h3>Administración</h3>
                    <div className='cajahija'>
                        <PostApps />
                        <UpdateApps />
                        <DeleteApps />
                    </div >
                </div >
            )}
        </>
    )
}
export default AppsPanel;