import React, { createContext } from "react";

export type UserType = {
    email: string;
    id: number;
    name: string;
}

type Props = {
    children: React.ReactNode;
}

export const UserContext = createContext<{ userData: UserType | null, setUserData: React.Dispatch<React.SetStateAction<UserType | null>> } | null>(null);

const UserContextProvider = (props: Props) => {
    const [userData, setUserData] = React.useState<UserType | null>(null);
    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {props.children};
        </UserContext.Provider>
    )
}

export default UserContextProvider;
