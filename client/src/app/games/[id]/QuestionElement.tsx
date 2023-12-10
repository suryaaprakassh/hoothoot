"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useEffect, useState } from "react";
import EditableArea from "./EditableArea";
import { Button } from "@/components/ui/button";

type Props = {
  focus: boolean;
  id: number;
  setFocus: React.Dispatch<React.SetStateAction<number>>;
  setQuestion: React.Dispatch<React.SetStateAction<QuestionType[]>>;
};

export type OptionType = {
  optionName: string;
  stateKey: string;
  setState: React.Dispatch<React.SetStateAction<QuestionType>>;
};

const OptionElement = (props: OptionType) => {
  return (
    <div className="flex space-x-10 my-2 items-center">
      <RadioGroupItem value={props.optionName} />
      <EditableArea
        htmlFor={props.optionName}
        stateKey={props.stateKey}
        setState={props.setState}
      />
    </div>
  );
};

export type QuestionType = {
  question: string;
  opt1: string;
  opt2: string;
  opt3: string;
  opt4: string;
  ans: string;
};

const QuestionElement = (props: Props) => {
  const options: string[] = [
    "opt1",
    "opt2",
    "opt3",
    "opt4",
  ];
  const [question, setQuestion] = useState<QuestionType>({
    question: "",
    opt1: "",
    opt2: "",
    opt3: "",
    opt4: "",
    ans: "opt1",
  });
  const [optionCounter, setOptionCounter] = useState<number>(2);

  useEffect(() => {
    if (props.focus == false) {
      props.setQuestion((prev) => {
        prev[props.id] = { ...question };
        return prev;
      });
    }
  }, [props.focus]);

  return (
    <div
      className={`my-5 flex flex-col`}
      onClick={() => {
        if (props.focus == false) {
          props.setFocus(props.id);
        }
      }}
    >
      <EditableArea
        setState={setQuestion}
        stateKey="question"
      />
      <RadioGroup
        defaultValue="opt1"
        value={question.ans}
        className="my-4"
        onValueChange={(val) => {
          setQuestion((prev) => {
            return {
              ...prev,
              ans: val,
            };
          });
        }}
      >
        {options.slice(0, optionCounter).map((q) => (
          <OptionElement
            key={q}
            stateKey={q}
            optionName={q}
            setState={setQuestion}
          />
        ))}
      </RadioGroup>
      {optionCounter < 4 && (
        <Button
          className="self-center"
          onClick={() => {
            setOptionCounter((prev) => {
              if (prev == 4) {
                return 4;
              }
              return prev + 1;
            });
          }}
        >
          add
        </Button>
      )}
    </div>
  );
};

export default QuestionElement;
