"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import QuestionElement, { QuestionType } from "./QuestionElement";
import React, { use, useEffect, useState } from "react";
import { useAxios } from "@/lib/axios";
import useAuth from "@/components/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const page = ({ params }: { params: { id: number } }) => {
  useAuth();
  const [focus, setFocus] = useState<number>(0);
  const [questions, setQuestions] = useState<QuestionType[]>([
    {
      question: "",
      ans: "",
      opt1: "",
      opt2: "",
      opt3: "",
      opt4: "",
    },
  ]);

  const router = useRouter();

  const submitData = async () => {
    setFocus(-1);
    const response = await useAxios.post("/game/add", {
      questions,
      gameId: params.id,
    });

    console.log("response====", response);
  };


  useEffect(() => {
    const func = async () => {
      try {
        await useAxios.post("/game/verify", {
          id: params.id,
        });
      } catch (error: any) {
        toast.error(error?.message);
        router.push("/");
      }
    };
    func();
  }, []);
  return (
    <div className="flex flex-col justify-center">
      <Card className="p-5">
        <CardTitle>Game Tile</CardTitle>
        <CardDescription>Edit Your Game Details Here</CardDescription>
        <CardContent className="flex space-x-10 my-4">
          <Button
            onClick={submitData}
          >
            Save
          </Button>
          <Button variant="destructive">Delete</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {questions.map((_, index) => {
            return (
              <QuestionElement
                key={index}
                focus={focus == index}
                id={index}
                setFocus={setFocus}
                setQuestion={setQuestions}
              />
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button
            onClick={() => {
              setQuestions((prev) => {
                return [...prev, {
                  question: "",
                  ans: "",
                  opt1: "",
                  opt2: "",
                }];
              });
            }}
          >
            Add Question
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
