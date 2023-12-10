"use client"

import React, { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

type Props = {
    children: ReactNode
}

const ToastProvider = (props: Props) => {
    return (
        <>
            <Toaster />
            {props.children}
        </>
    )
}

export default ToastProvider; 
