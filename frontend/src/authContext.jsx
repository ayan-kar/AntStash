import React, { createContext,useState,useEffect,useContext } from "react";

const AuthContext = createContext();

export const useAuth = ()=>{

    return useContext(AuthContext)
}

export const AuthProvider=({children})=>{
    const [currentUser,SetcurrentUser]=useState(null);
    useEffect(()=>{
        const userId =localStorage.getItem('userId');
        if(userId){
            SetcurrentUser(userId);
        }
    },[]);
    const value ={
        currentUser,SetcurrentUser
    }
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}