"use client"
import { useSocket } from '@/components/SocketProviders';
import useAuth from '@/components/hooks/useAuth';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';

const GamePlay = () => {
    useAuth();
    const router = useRouter();
    const socket = useSocket();
    const searchParams = useSearchParams();
    const [gamePin, setGamePin] = React.useState<string>("");
    const [playerName, setPlayerName] = React.useState<string>("");
    useEffect(() => {
        const gamePinParams = searchParams.get("gamePin");
        const playerNameParams = searchParams.get("playerName");
        if (!gamePinParams || !playerNameParams) {
            toast.error("Invalid GameId or PlayerName");
            router.push("/");
        }
        setGamePin(gamePinParams as string);
        setPlayerName(playerNameParams as string);
    }, [])

    useEffect(() => {
        if (!socket) return;
        socket.connect();
        socket.on("connect", () => {
            socket.emit("join-game", {
                gamePin,
                playerName
            })
        })
    }, [socket]);
    return (
        <div>GamePlay</div>
    )
}

export default GamePlay; 