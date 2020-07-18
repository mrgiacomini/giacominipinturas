import React, {createContext, useState, useEffect, useContext} from 'react';
import { isAuth, authenticate, signout } from '../helpers/auth';

interface AuthContextData {
    isLoggedIn: boolean,
    user: any | null;
    loading: boolean;
    login(data: any, next: Function): void;
    logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({ children }:{ children: any }) => {
    const [user, setUser] = useState<any>(false);
    const [loading, setLoading] = useState(true);
   
    useEffect(() => {
        const loadToken = async ()=>{
            setUser(await isAuth());
            setLoading(false);
        };
        loadToken();
    },[]);

    function login(data: any, next: Function) {
        authenticate(data, (response: any) => {
            setUser(response);
            next(response);
        });
    }

    function logout() {
        signout();
        setUser(false);
    }

    return (
        <AuthContext.Provider
            value={{isLoggedIn: !!user, user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>        
    );
};

function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }

    return context;
}

export {AuthProvider, useAuth};