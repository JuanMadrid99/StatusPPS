import { React, useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import InfoManual from '../../components/Informes/infor_Manuales.jsx';

const ManualInfo = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1 || user.id === 2 || user.id === 3 || user.id === 4) && (
                <div>
                    <InfoManual />
                </div>
            )}
        </>
    );
};

export default ManualInfo;