"use client"
import React, { useEffect } from 'react'
import { io } from "socket.io-client"

type Props = {}

const PlayComponent = (props: Props) => {
    useEffect(() => {
        const socket = io("http://localhost:8000");

        socket.on("connect", () => {
            console.log("connected to server")
        });
    }, []);
    return (
        <div>page</div>
    )
}

export default PlayComponent