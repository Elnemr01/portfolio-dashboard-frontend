import React from 'react'
import { Navigate } from 'react-router'

const Protected = ({children}) => {

    if(localStorage.getItem("access")!=='loggedin'){
        return <Navigate to="/login" replace={true}/>
    }

    return (
        children
    )
}

export default Protected