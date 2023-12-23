"use client";
import useAuth from '@/components/hooks/useAuth';
import { Button } from '@/components/ui/button'
import { useAxios } from '@/lib/axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';

type GameDataType = {
    name: string;
    gameId: number;
};


const startGame = (gameId: number) => {

};

const GameNameElement = (props: GameDataType) => {
    return (
        <div className='flex justify-around p-5 my-2' key={props.name + props.gameId}>
            <h2 className='text-xl font-bold'>{props.name}</h2>
            <div className='flex space-x-4'>
                <Button onClick={() => {
                    startGame(props.gameId);
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
                    setGameData(response.data.gameData);
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
                    gameData.map(game => (<GameNameElement key={game.gameId + game.name} {...game} />))
                }
            </div>
        </div >
    )
}

export default GameMainPage;

/*
should move to a new page
get a socket connection
get the list of all palayers joined
*/