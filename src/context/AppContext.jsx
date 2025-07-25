import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));
        if (usuarioSalvo) {
            setUser(usuarioSalvo);
        }
    }, []);

    return (
        <AppContext.Provider value={{ user, setUser }}>
            {children}
        </AppContext.Provider>
    );

};


export const useAppContext = () => useContext(AppContext);