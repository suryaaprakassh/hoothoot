"use client";
import { useSocket } from "@/components/SocketProviders";
import useAuth from "@/components/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import GamePlayQuestions from "./GamePlayQuestiions";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const GamePlay = () => {
  useAuth();
  const router = useRouter();
  const socket = useSocket();
  const searchParams = useSearchParams();
  const [gamePin, setGamePin] = React.useState<string>("");
  const [playerName, setPlayerName] = React.useState<string>("");
  const [started, setStarted] = React.useState<boolean>(false);
  useEffect(() => {
    const gamePinParams = searchParams.get("gamePin");
    const playerNameParams = searchParams.get("playerName");
    if (!gamePinParams || !playerNameParams) {
      toast.error("Invalid GameId or PlayerName");
      router.push("/");
    }
    setGamePin(gamePinParams as string);
    setPlayerName(playerNameParams as string);
    if (!socket) return;
    socket.connect();
    socket.on("connect", () => {
      socket.emit("join-game", {
        gamePin: gamePinParams,
        playerName: playerNameParams,
      });
    });

    socket.on("invalid-pin", () => {
      toast.error("Invalid GameId");
    });

    socket.on("start-game", (game) => {
      setStarted(true);
    });
    return () => {
      socket.off();
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {started
        ? <GamePlayQuestions socket={socket} />
        : <div>Waiting for host to start the game</div>}
    </div>
  );
};

export default GamePlay;
