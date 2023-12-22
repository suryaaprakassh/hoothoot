import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { QuestionType } from "./QuestionElement";

type Props = {
  htmlFor?: string;
  stateKey: string;
  setState: React.Dispatch<React.SetStateAction<QuestionType>>;
};

const EditableArea = (props: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [text, setText] = useState<string>("");

  return (
    <div className="w-2/5">
      {isEditing || text == ""
        ? (
          <Input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onBlur={() => {
              setIsEditing(false);
              props.setState((prev: QuestionType) => {
                return {
                  ...prev,
                  [props.stateKey]: text,
                };
              });
            }}
            className="text-xl"
          />
        )
        : props.htmlFor
          ? (
            <Label
              className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0 cursor-pointer"
              htmlFor={props.htmlFor}
              onDoubleClick={() => {
                setIsEditing(true);
              }}
            >
              {text}
            </Label>
          )
          : (
            <h2
              className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 cursor-pointer"
              onDoubleClick={() => {
                setIsEditing(true);
              }}
            >
              {text}
            </h2>
          )}
    </div>
  );
};

export default EditableArea;
