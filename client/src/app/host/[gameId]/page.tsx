"use client";
import GameQuestions from "@/app/play/GameQuestions";
import { useSocket } from "@/components/SocketProviders";
import { Button } from "@/components/ui/button";
import { useAxios } from "@/lib/axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  params: {
    gameId: string;
  };
};
type PlayerType = {
  id: string;
  name: string;
};
const HostGameComponent = (props: Props) => {
  const [players, setPlayers] = React.useState<PlayerType[]>([]);
  const [gamePin, setGamePin] = React.useState<string>("");
  const [started, setStarted] = React.useState<boolean>(false);
  const socket = useSocket();
  useEffect(() => {
    const func = async () => {
      try {
        const response = await useAxios.post("/game/getGamePin", {
          gameId: props.params.gameId,
        });
        if (response.data.status === "success") {
          setGamePin(response.data.gamePin);
        } else {
          toast.error("Something went wrong");
        }
      } catch (error: any) {
        toast.error(error?.message);
      }
    };
    func();
  }, [props.params.gameId]);

  useEffect(() => {
    if (gamePin === "" || !socket) return;
    else {
      socket.on("connect", () => {
        socket.emit("create-game", gamePin);
        console.log("game -created!")
      });
    }
  }, [gamePin, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("connected to server");
    });

    socket.on("player-joined", (playerName) => {
      setPlayers([...players, playerName]);
    });

    socket.on("player-disconnected", (id) => {
      setPlayers(players.filter((player) => player.id !== id));
    });


    return (() => {
      socket.off("connect");
      socket.off("player-joined");
      socket.off("player-disconnected");
      socket.disconnect();
    });
  }, [socket]);

  return (
    <main>
      {
        started ? (<GameQuestions socket={socket} />) : (
          <div>
            <h2>Players Joined</h2>
            <h2>Game Pin: {gamePin}</h2>
            <Button
              onClick={() => {
                if (!socket) {
                  toast.error("Please Try Again After Sometime!");
                  return;
                }
                socket.emit("start-game");
                setStarted(true);
              }}
            >
              Start
            </Button>
            <div>
              {players.map((player, index) => (
                <p key={index + 1}>{index + 1}. {player.name}</p>
              ))}
            </div>
          </div>
        )
      }
    </main>
  );
};

export default HostGameComponent;
