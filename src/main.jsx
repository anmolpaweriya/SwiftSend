import React from 'react'
import ReactDOM from 'react-dom/client'




// css
import './index.css'







// components
import App from './App.jsx'






// context api provider
import APIProvider from './CustomHooks/useGetAPI'
import SocketProvider from './CustomHooks/useSocket'
import UserNameProvider from './CustomHooks/UserNameProvider'
import ConnectedUserProvider from './CustomHooks/useConnectedUser'
import PeerProvider from './CustomHooks/usePeer'
import { LoadingProvider } from './Components/PreLoader/PreLoader'









ReactDOM.createRoot(document.getElementById('root')).render(
  <LoadingProvider>

    <UserNameProvider>
      <APIProvider>
        <SocketProvider>
          <ConnectedUserProvider>
            <PeerProvider>





              <App />






            </PeerProvider>
          </ConnectedUserProvider>
        </SocketProvider>
      </APIProvider>
    </UserNameProvider>
  </LoadingProvider>

)
