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
import React, { useState } from "react";

const page = () => {
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
  return (
    <div className="flex flex-col justify-center">
      <Card className="p-5">
        <CardTitle>Game Tile</CardTitle>
        <CardDescription>Edit Your Game Details Here</CardDescription>
        <CardContent className="flex space-x-10 my-4">
          <Button
            onClick={() => {
              setFocus(-1);
            }}
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
                  opt3: "",
                  opt4: "",
                }];
              });
            }}
          >
            Add Question
          </Button>
          <Button
            onClick={() => {
              console.log(questions);
            }}
          >
            test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
