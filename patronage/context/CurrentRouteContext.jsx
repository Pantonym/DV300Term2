import React, { createContext, useContext, useState } from 'react';

const CurrentRouteContext = createContext();

export const useCurrentRoute = () => useContext(CurrentRouteContext);

export const CurrentRouteProvider = ({ children }) => {
    const [currentRoute, setCurrentRoute] = useState('ShortStoriesScreen');

    return (
        <CurrentRouteContext.Provider value={{ currentRoute, setCurrentRoute }}>
            {children}
        </CurrentRouteContext.Provider>
    );
};