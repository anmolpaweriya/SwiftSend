import React, { useContext } from "react";
import { io } from 'socket.io-client'







// custom hooks
import { useGetAPI } from "./useGetAPI";









// Context api
export const SocketContext = React.createContext();





// functions



export function useSocket() {
    return useContext(SocketContext);
}




export default function SocketProvider({ children }) {


    // custom hooks
    const api = useGetAPI();






    const socket = io(api, { autoConnect: false });














    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
}