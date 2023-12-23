"use client"
import { useSocket } from '@/components/SocketProviders'
import { useAxios } from '@/lib/axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

type Props = {
    params: {
        gameId: string;
    }
}
const HostGameComponent = (props: Props) => {
    const [players, setPlayers] = React.useState<string[]>([]);
    const [gamePin, setGamePin] = React.useState<string>("");
    const socket = useSocket();
    useEffect(() => {
        const func = async () => {
            try {
                const response = await useAxios.post("/game/getGamePin", {
                    gameId: props.params.gameId
                });
                if (response.data.status === "success") {
                    setGamePin(response.data.gamePin);
                } else {
                    toast.error("Something went wrong");
                }
            } catch (error: any) {
                toast.error(error?.message);
            }
        }
        func();
    }, [props.params.gameId])

    useEffect(() => {
        if (gamePin === "" || !socket) return;
        else {
            socket.on("connect", () => {
                socket.emit("create-game", gamePin);
            })
        }
    }, [gamePin, socket])

    useEffect(() => {
        if (!socket) return;

        socket.connect();

        socket.on("connect", () => {
            console.log("connected to server")
        });

        socket.on("player-joined", (playerName) => {
            setPlayers([...players, playerName]);
        })

        socket.on("player-disconnected", ({ playerName }) => {
            setPlayers(players.filter(player => player !== playerName));
        });

        return (() => {
            socket.off("connect");
            socket.off("player-joined");
            socket.off("player-disconnected");
            socket.disconnect();
        })
    }, [socket]);

    return (
        <div>
            <h2>Players Joined</h2>
            <h2>Game Pin: {gamePin}</h2>
            <div>
                {
                    players.map((player, index) => (<p>{index + 1}. {player}</p>))
                }
            </div>
        </div>
    )
}

export default HostGameComponent 