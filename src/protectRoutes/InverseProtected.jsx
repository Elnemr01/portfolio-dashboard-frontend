import React from 'react'
import { Navigate } from 'react-router'

const InverseProtected = ({children}) => {

    if(localStorage.getItem("access")==='loggedin'){
        return <Navigate to="/" replace={true}/>
    }

    return (
        children
    )
}

export default InverseProtected