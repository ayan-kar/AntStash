import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoutes } from 'react-router-dom';
 
import Dashboard from "./components/dashboard/Dashboard.jsx"
import Profile from "./components/user/Profile.jsx"
import Login from "./components/auth/Login.jsx"
import Signup from "./components/auth/Signup.jsx"

import { useAuth } from "./authContext";

const projectRoutes =()=>{
    const [currentUser,SetcurrentUser]=useAuth();
    const navigate = useNavigate()

    useEffect(()=>{
        const userIdFromStroage =localStorage.getItem("userId")
        if(userIdFromStroage & !currentUser){
            SetcurrentUser(userIdFromStroage);
        }
        if(!userIdFromStroage  && !["/auth","/singup"].includes(window.location.pathname)){
            navigate("/auth")
        }
        if(userIdFromStroage  && window.location.pathname=="/auth"){
            navigate("/")
        }
    },[currentUser,navigate,SetcurrentUser]);
    
     let element = useRoutes([
        {
            path:"/",
            element:<Dashboard/>

        },
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        }
     ])

     return element;

}

export default projectRoutes;

