import { useSocket } from '@/components/SocketProviders'
import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { IoIosStar } from "react-icons/io";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoMdPlanet } from "react-icons/io";
import { IconType } from "react-icons";

type Props = {
    socket: Socket | null
}

type OptionType = {
    val: string | null
    key: string
}

type QuestionType = {
    question: string,
    options: OptionType[],
};

const GameQuestions = (props: Props) => {
    const [question, setQuestion] = useState<QuestionType>({ question: "question test", options: [{ key: "opt1", val: "test" }, { key: "opt2", val: "test" }, { key: "opt3", val: "test" }, { key: "opt4", val: "test" },] })
    const iconMap: { [key: string]: IconType } = {
        "opt1": IoIosStar,
        "opt2": FaSun,
        "opt3": FaMoon,
        "opt4": IoMdPlanet
    };
    useEffect(() => {
        const socket = props.socket;
        if (!socket) return;
        socket.on("new-question", question => {
            setQuestion(question);
            console.log("new question========>", question);
        })

        return () => {
            socket.off("new-question")
        }

    }, [props.socket])
    return (
        <div>
            <div className="text-3xl font-bold">{question.question}</div>
            <div className="grid grid-cols-2 gap-4 mt-5">
                {
                    question.options.map((option, index) => {
                        const Icon = iconMap[option.key];
                        if (!option.val) return;
                        return (
                            <div key={index} className="bg-gray-800 text-white text-2xl p-5 rounded-md flex  items-center justify-between">
                                {
                                    <>
                                        <p>
                                            {option.val}
                                        </p>
                                        <Icon size={60} />
                                    </>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default GameQuestions