import React, { useContext, useRef, useState } from "react"
import { Peer } from "peerjs";
import download from 'downloadjs'
import JSZip from 'jszip';




// custom hooks
import { useSocket } from "./useSocket";





// context api
const PeerContext = React.createContext();
const ConnectPeerContext = React.createContext();













// functions
export function usePeer() {
    return useContext(PeerContext)
}

export function useConnectPeer() {
    return useContext(ConnectPeerContext)
}







export default function PeerProvider({ children }) {


    const socket = useSocket();

    const fileBuffer = useRef({});

    const chunkSize = 1 * (1024 * 1024); // 1 MB
    const [peer, setPeer] = useState();












    // functions



    function _(el) { return document.querySelector(el); }

    function sendBufferChunk(
        connectedPeer,
        peerId,
        fileName,
        fileType,
        buffer,
    ) {


        const totalChunkNum = Math.ceil(buffer.byteLength / chunkSize);


        const conn = connectedPeer.connect(peerId);     // create connection 
        let chunkNum = 1;


        conn.on('open', () => {

            for (; chunkNum < totalChunkNum; chunkNum++) {
                const chunk = buffer.slice((chunkNum - 1) * chunkSize, chunkNum * chunkSize);
                conn.send({
                    file: chunk,
                    chunkNum,
                    totalChunkNum
                })
            }



            const finalchunk = buffer.slice((totalChunkNum - 1) * chunkSize, totalChunkNum * chunkSize);
            conn.send({
                file: finalchunk,
                fileName,
                fileType,
                chunkNum: totalChunkNum,
                totalChunkNum
            })

        })



    }







    function updateProgressBar(id, percentage) {

        _(`.UserDiv[data-id="${id}"]`).setAttribute('style', `
        --progress: ${percentage}%`)

    }







    function connectPeerFunc() {

        const iceServers =  [
            {
              urls: "stun:stun.relay.metered.ca:80",
            },
            {
              urls: "turn:global.relay.metered.ca:80",
              username: "2ad699eea1f2f61b1f11958b",
              credential: "5tcqmBTXblTRGu/p",
            },
            {
              urls: "turn:global.relay.metered.ca:80?transport=tcp",
              username: "2ad699eea1f2f61b1f11958b",
              credential: "5tcqmBTXblTRGu/p",
            },
            {
              urls: "turn:global.relay.metered.ca:443",
              username: "2ad699eea1f2f61b1f11958b",
              credential: "5tcqmBTXblTRGu/p",
            },
            {
              urls: "turns:global.relay.metered.ca:443?transport=tcp",
              username: "2ad699eea1f2f61b1f11958b",
              credential: "5tcqmBTXblTRGu/p",
            },
        ]

        const connectedPeer = new Peer(socket.id, {iceServers});



        connectedPeer.on('connection', conn => {
            conn.on('data', async (data) => {

                console.log('peer', data)
                if (data.message && (data.message == 'startDownload')) {
                    let file = _(`.UserDiv[data-id="${conn.peer}"] .fileInput`).files;



                    // zipping for multilple files 
                    if (file.length > 1) {

                        const zip = new JSZip();
                        Array.from(file).forEach(fileElement => {
                            zip.file(fileElement.name, fileElement)

                        })

                        file = await zip.generateAsync({ type: "blob" })
                        console.log(file)

                    } else
                        file = file[0];


                    const reader = new FileReader();
                    reader.onload = (event) => {



                        // change btn text
                        _(`.UserDiv[data-id="${conn.peer}"] .FileSendBtn`).innerHTML = `
        <i class="fa fa-circle-o-notch fa-spin"></i>
        downloading ...
        `;


                        // send file chunk to connected peer
                        sendBufferChunk(
                            connectedPeer,
                            conn.peer,
                            data.fileName,
                            file.type,
                            reader.result
                        );






                    };
                    reader.readAsArrayBuffer(file)

                }


                else if (data.file) {

                    // update progress bar
                    const percentage = (data.chunkNum / data.totalChunkNum) * 100;
                    updateProgressBar(conn.peer, percentage)



                    if (!fileBuffer.current[conn.peer])
                        fileBuffer.current[conn.peer] = { buffer: [] };

                    fileBuffer.current[conn.peer].buffer.push(data.file);
                    fileBuffer.current[conn.peer].chunkNum = data.chunkNum;



                    if (data.chunkNum < data.totalChunkNum) return;


                    const file = new File(fileBuffer.current[conn.peer].buffer, data.fileName, { type: data.fileType })


                    fileBuffer.current[conn.peer] = undefined;


                    socket.emit('downloadCompleted', conn.peer);
                    updateProgressBar(conn.peer, 0)
                    _(`.UserDiv[data-id="${conn.peer}"]`).classList.remove("downloadShowUser");
                    _(`.UserDiv[data-id="${conn.peer}"]`).classList.remove("startProgress");

                    download(file, data.fileName)
                }
            })


        })






        setPeer(connectedPeer)
    }







    // return

    return <PeerContext.Provider value={peer}>
        <ConnectPeerContext.Provider value={connectPeerFunc}>

            {children}

        </ConnectPeerContext.Provider>
    </PeerContext.Provider >
}