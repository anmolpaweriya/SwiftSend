import React, { useContext } from "react";



// context api
export const APIContext = React.createContext();





// functions 

export function useGetAPI() {
    return useContext(APIContext)
}




export default function APIProvider({ children }) {

    // const api = 'http://localhost:8000'
    // const api = 'https://apdropserver.glitch.me';
    const api = 'https://swiftsend.publicvm.com';



    return <APIContext.Provider value={api}>
        {children}
    </APIContext.Provider>

}