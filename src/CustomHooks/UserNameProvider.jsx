import React, { useContext, useRef, useState } from "react";




// components
import Input from "../Components/Input/Input";



// css
import './TakeUserName.css'







// content api
export const UserNameContext = React.createContext();






// functions

export function useUserName() {
    return useContext(UserNameContext);
}



export default function UserNameProvider({ children }) {



    // variables
    const usernameInputRef = useRef();




    // const username = getUserNameInputWithPrompt();
    const [username, setUsername] = useState(null)


    function enterCallBack() {
        if (usernameInputRef.current.value.trim() == "") {

            usernameInputRef.current.focus()

            return;
        }


        document.querySelector('.takeUserNameInput').classList.add('hideUserNameModel')
        setTimeout(() => {
            setUsername(usernameInputRef.current.value.trim());

        }, 500);


    }


    return (
        <UserNameContext.Provider value={username}>
            <div className="takeUserNameInput">


                <h3>Enter Your Name  </h3>


                <Input
                    type='text'
                    text='Name'
                    refVar={usernameInputRef}
                    enterCallBack={enterCallBack}
                />
                <button
                    className="JoinBtn"
                    onClick={enterCallBack}
                >Join</button>
            </div>
            {children}
        </UserNameContext.Provider>
    )
}


