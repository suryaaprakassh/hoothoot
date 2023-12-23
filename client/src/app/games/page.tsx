"use client";
import useAuth from '@/components/hooks/useAuth';
import { Button } from '@/components/ui/button'
import { useAxios } from '@/lib/axios';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';

type GameDataType = {
    name: string;
    id: number;
};



const GameNameElement = (props: GameDataType) => {
    const router = useRouter();
    const startGame = async (gameId: number) => {
        router.push(`/host/${gameId}`);
    };
    return (
        <div className='flex justify-around p-5 my-2' key={props.name + props.id}>
            <h2 className='text-xl font-bold'>{props.name}</h2>
            <div className='flex space-x-4'>
                <Button onClick={() => {
                    startGame(props.id);
                }}>Start</Button>
                <Button variant="outline">Edit</Button>
            </div>
        </div>
    )
}

const GameMainPage = () => {
    useAuth();
    const [gameData, setGameData] = React.useState<GameDataType[]>([]);
    useEffect(() => {
        try {
            useAxios.get('/game/getAll').then((response) => {
                if (response.data.status === "success") {
                    setGameData([...response.data.gameData]);
                } else {
                    toast.error("Something went wrong");
                }
            });
        } catch (error: any) {
            toast.error("Something went wrong");
        }
    }, [])

    return (
        <div>
            <h2 className='text-center font-bold text-2xl'>Game Main Page</h2>
            <div>
                {
                    gameData.map(game => (<GameNameElement key={game.id + game.name} id={game.id} name={game.name} />))
                }
            </div>
        </div >
    )
}

export default GameMainPage;
