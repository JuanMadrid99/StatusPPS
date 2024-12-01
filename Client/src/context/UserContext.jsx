import React, { createContext, useState, useEffect } from 'react';
import fetchData from '../api/connect';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetchData(`http://${process.env.REACT_APP_HOST}/api/user`);
                if (!response.ok) {
                    throw new Error('Sin respuesta');
                }
                const data = await response.json();
                
                setUser(data);
            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};
