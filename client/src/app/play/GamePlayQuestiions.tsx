import { Card } from '@/components/ui/card'
import React, { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { IoIosStar } from "react-icons/io";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoMdPlanet } from "react-icons/io";

type Props = {
    socket: Socket | null,
}


const GamePlayQuestions = (props: Props) => {
    useEffect(() => {
        const socket = props.socket;
        if (!socket) return;

        socket.on("new-question", question => {

        })

        return () => {
            socket.off("new-question")
        }

    }, [props.socket])
    const icons = [
        IoIosStar,
        FaSun,
        FaMoon,
        IoMdPlanet
    ]
    return (
        <div className='grid grid-cols-2'>
            {
                icons.map((Icon, index) => (
                    <Card key={index} className='h-64 m-5 text-3xl flex items-center justify-center'>
                        <Icon size="120" />
                    </Card>
                ))
            }
        </div>
    )
}

export default GamePlayQuestions;