import { useRef } from "react";



// custom hoooks
import { useSocket } from "../../CustomHooks/useSocket"
import { useUserName } from "../../CustomHooks/UserNameProvider";







export default function UserConnectBar() {

    const peerIdInput = useRef();



    //custom hooks
    const socket = useSocket();
    const username = useUserName();
















    // functions 

    function copyIdToClipboard() {
        window.navigator.clipboard.writeText(socket.id);
        document.querySelector('.PeerConnectSection>h3>.copyIconSpan').classList.add('activeCopyBtn')

        setTimeout(() => {

            document.querySelector('.PeerConnectSection>h3>.copyIconSpan').classList.remove('activeCopyBtn')
        }, 2000);

    }


    function ConnectPeerIdFunc() {
        socket.emit('ConnectWithPeerId', peerIdInput.current.value, username)
    }




    return <div className="PeerConnectSection">
        <h3
            onClick={copyIdToClipboard}
        >your peer id : <strong>{socket.id}</strong>

            <a
                onClick={copyIdToClipboard}
                className="copyIconSpan">
                <i className="fa fa-copy"></i>
            </a>
        </h3>


        <div className="userConnectBarDiv">
            <input
                type="text"
                ref={peerIdInput}
                spellCheck={false}
                placeholder="Connect Peer Id"
            />
            <button
                onClick={ConnectPeerIdFunc}
            >Connect</button>
        </div>
    </div>
}