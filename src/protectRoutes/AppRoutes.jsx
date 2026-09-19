import React from 'react'
import Protected from './Protected'
import { Outlet } from 'react-router'

const AppRoutes = () => {
    return (
        <Protected>
            <Outlet/>
        </Protected>
    )
}

export default AppRoutes