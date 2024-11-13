import React, { useContext, useState } from "react";




// context api 
const ConnectedUserContext = React.createContext();
const SetConnectedUserContext = React.createContext();
const AppendConnectedUserContext = React.createContext();
const RemoveConnectedUserContext = React.createContext();












// functions



export function useConnectedUserList() { return useContext(ConnectedUserContext) }

export function useSetConnectedUserList() { return useContext(SetConnectedUserContext) }




export function useAppendConnectedUser() { return useContext(AppendConnectedUserContext); }


export function useRemoveConnectedUser() { return useContext(RemoveConnectedUserContext); }










export default function ConnectedUserProvider({ children }) {


    const [connectedUserList, setConnectedUserList] = useState({})





    function appendConnectedUser(userObj) {
        setConnectedUserList(e => {
            return {
                ...e,
                [userObj.id]: userObj
            }
        })
    }


    function removeConnectedUser(id) {

        setConnectedUserList(e => {
            delete e[id];
            return {
                ...e
            };
        })
    }

    return <ConnectedUserContext.Provider value={connectedUserList}>
        <SetConnectedUserContext.Provider value={setConnectedUserList}>
            <AppendConnectedUserContext.Provider value={appendConnectedUser}>
                <RemoveConnectedUserContext.Provider value={removeConnectedUser}
                >



                    {children}


                </RemoveConnectedUserContext.Provider>
            </AppendConnectedUserContext.Provider>
        </SetConnectedUserContext.Provider>
    </ConnectedUserContext.Provider>
}