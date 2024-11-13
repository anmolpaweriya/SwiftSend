import { useEffect } from "react"







// Components
import UserDetail from "./Components/UserDetail/UserDetail";
import UserList from "./Components/UserList/UserList";










// custom hooks
import { useSocket } from "./CustomHooks/useSocket"
import { useUserName } from "./CustomHooks/UserNameProvider";
import { useAppendConnectedUser, useRemoveConnectedUser } from "./CustomHooks/useConnectedUser";
import { useConnectPeer, usePeer } from "./CustomHooks/usePeer";
import PreLoader, { useLoadingStart, useLoadingStop } from "./Components/PreLoader/PreLoader";







function App() {



  // custom hooks
  const peer = usePeer();
  const socket = useSocket();
  const username = useUserName();
  const connectPeerFunc = useConnectPeer()
  const appendConnectedUser = useAppendConnectedUser();
  const removeConnectedUser = useRemoveConnectedUser();

  const loadingStop = useLoadingStop();









  // functions

  function _(el) { return document.querySelector(el); }

  function reloadProfilePic() {

    fetch(`https://api.multiavatar.com/${socket.id}?apikey=HUifqakYcTK94I`)
      .then(response => response.text())
      .then(data => {

        document.querySelector('.UserDiv>.profileSvg').innerHTML = data

      })
  }

  function fileSizeFormat(sizeByte) {

    const format = ["B", "KB", "MB", "GB"];

    let n = 0;
    while (sizeByte > 1024) {
      sizeByte /= 1024;
      n++;
    }
    return `${sizeByte.toFixed(2)} ${format[n]}`


  }



  function nearbyDeviceConnect(socketId, name) {



    appendConnectedUser({
      id: socketId,
      name
    })

    socket.emit('ConnectBack', socketId, socket.id, username)

  }




  function ConnectBack(socketId, name) {


    appendConnectedUser({
      id: socketId,
      name
    })

  }
  function getDownloadRequest(userId, fileName, fileSize) {
    _(`.UserDiv[data-id="${userId}"]`).classList.add("downloadShowUser")
    _(`.UserDiv[data-id="${userId}"]`).classList.add("activeUserDiv");



    _(`.UserDiv[data-id="${userId}"] .DownloadFileNameDisplay`).innerText = `${fileName} (${fileSizeFormat(fileSize)})`;


  }



  function downloadCompleted(id) {
    _(`.UserDiv[data-id="${id}"] .FileSendBtn`).innerHTML = 'Downloaded';



  }

  function cancelDownloadRequest(socketId) {
    _(`.UserDiv[data-id="${socketId}"] .FileSendBtn`).innerHTML = `Cancelled`
  }

















  // window events

  window.onbeforeunload = () => {
    socket.emit('disconnectUser')
  }












  useEffect(() => {














    // socket

    if (socket.connected) {
      loadingStop('MainPage');
      return;
    }


    if (username)
      loadingStop('MainPage');
    else
      return


    socket.on('connect', () => {
      reloadProfilePic();

      connectPeerFunc();
      loadingStop('MainPage');



      // emit events
      socket.emit('ConnectWithNearbyDevice', username)






      // listening events
      socket.on('nearbyDeviceConnect', nearbyDeviceConnect)
      socket.on('connectWithId', nearbyDeviceConnect)
      socket.on('ConnectBack', ConnectBack)
      socket.on('getDownloadRequest', getDownloadRequest);
      socket.on('cancelDownloadRequest', cancelDownloadRequest)
      socket.on('downloadCompleted', downloadCompleted)
      socket.on('disconnectUser', removeConnectedUser)




    })



    socket.connect();
  }, [peer, username])










  // return JSX

  return (
    <>
      <PreLoader
        id={'MainPage'}
      />

      <UserDetail />
      <h1 className="head-text">Connected Users</h1>
      <UserList />
    </>
  )
}

export default App
