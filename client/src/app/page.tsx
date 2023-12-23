"use client";
import useAuth from "@/components/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAxios } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { use, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const loading = useAuth();
  const [gameName, setGameName] = useState<string>("");
  const [gamePin, setGamePin] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");

  const createGame = async () => {
    if (gameName == "" || !gameName) {
      toast.error("Please Specify a Game Name");
      setGameName("");
      return;
    }
    try {
      const resData = await useAxios.post("/game/create", {
        gameName,
      });
      toast.success(resData.data.message);
      router.push(`games/${resData.data.id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {loading
        ? <div>loading..</div>
        : (
          <div className="flex justify-center items-center h-screen flex-col space-y-16">
            <Tabs defaultValue="join" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="create">Create A Game</TabsTrigger>
                <TabsTrigger value="join">Join A Game</TabsTrigger>
              </TabsList>
              <TabsContent value="join">
                <Card>
                  <CardHeader>
                    <CardTitle>Join a Game</CardTitle>
                    <CardDescription>If you have a code</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between flex-col space-y-10 items-center">
                    <Input type="text" placeholder="game-pin" onChange={e => {
                      setGamePin(e.target.value);
                    }} value={gamePin} />
                    <Input type="text" placeholder="Your Game Name.." onChange={e => {
                      setPlayerName(e.target.value);
                    }} value={playerName} />
                    <Button onClick={() => {
                      router.push(`/play?gamePin=${gamePin}&playerName=${playerName}`);
                    }}>Join</Button> </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="create">
                <Card>
                  <CardHeader>
                    <CardTitle>Create a Game</CardTitle>
                    <CardDescription>Have your content ready</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between flex-col space-y-10 items-center">
                    <Input
                      type="text"
                      placeholder="game name"
                      value={gameName}
                      onChange={(e) => {
                        setGameName(e.target.value);
                      }}
                    />
                    <Button onClick={createGame}>Create</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <Button
              onClick={async () => {
                await useAxios.post("/auth/logout");
                router.push("/login");
              }}
            >
              Logout
            </Button>
          </div>
        )}
    </div>
  );
}
