import { useEffect, useRef } from "react";













// custom hooks
import { useSocket } from "../../CustomHooks/useSocket";
import { usePeer } from "../../CustomHooks/usePeer";












export default function ConnectedUser({ user }) {


    const fileInput = useRef();
    const fileNameDisplay = useRef();
    const userDetail = useRef()

    // custom hooks
    const socket = useSocket();
    const peer = usePeer();














    // functions

    function _(el) { return document.querySelector(el); }

    function toggleActiveUserFunc(e) {



        if (!e.target.classList.contains('UserDiv')) {
            toggleActiveUserFunc({ target: e.target.parentNode })
            return
        }
        e.target.classList.toggle('activeUserDiv')
    }

    function fileChangeFunc(e) {

        if (fileInput.current.files.length > 1) {
            const date = new Date();
            const zipName = `apDrop-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.zip`;

            let zipSize = 0;
            Array.from(fileInput.current.files).forEach(file => zipSize += file.size);


            fileNameDisplay.current.innerText = `${zipName}  (${fileSizeFormat(zipSize)} )`;

        } else
            fileNameDisplay.current.innerText = `${fileInput.current.files[0].name}  (${fileSizeFormat(fileInput.current.files[0].size)} )`;
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


    function changeFileFunc(e) {

        const element = _(`.UserDiv[data-id="${user.id}"] .FileSendBtn`);


        if (element.innerText.includes("...")) {
            e.preventDefault();
            return;
        }

        element.innerText = 'send';
    }


    function reloadProfilePic() {

        fetch(`https://api.multiavatar.com/${user.id}?apikey=HUifqakYcTK94I`)
            .then(response => response.text())
            .then(data => {

                userDetail.current.innerHTML = data

            })
    }

    function fileSendBtnFunc() {
        const files = fileInput.current.files;
        if (!files.length) {
            fileInput.current.click();
            return;
        }

        if (files.length > 1) {
            const zipName = fileNameDisplay.current.innerText.split(' ')[0];

            let zipSize = 0;
            Array.from(files).forEach(file => zipSize += file.size);


            socket.emit('sendDownloadRequest', user.id, zipName, zipSize);
        } else
            socket.emit('sendDownloadRequest', user.id, files[0].name, files[0].size);


        // change btn text
        _(`.UserDiv[data-id="${user.id}"] .FileSendBtn`).innerHTML = `
        <i class="fa fa-circle-o-notch fa-spin"></i>
        waiting ...
        `


    }

    function cancelDownloadRequest() {
        _(`.UserDiv[data-id="${user.id}"]`).classList.remove("downloadShowUser");

        socket.emit('CancelDownloadRequest', user.id)

    }

    function downloadBtnFunc() {

        _(`.UserDiv[data-id="${user.id}"]`).classList.add("startProgress");
        const conn = peer.connect(user.id);

        conn.on('open', () => {

            conn.send({
                message: 'startDownload',
                fileName: _(`.UserDiv[data-id="${user.id}"] .DownloadFileNameDisplay`).innerText.split(' ')[0]
            })
        })

    }




















    useEffect(() => {
        reloadProfilePic();
    }, [])











    return <a
        data-id={user.id}
        data-name={user.name}
        className="UserDiv"
    >


        <a className="UserDetailDiv"
            ref={userDetail}
            onClick={toggleActiveUserFunc}

        >
            <i className="fa fa-user"></i>

        </a>


        <div className="FileManageSection">
            <label
                onClick={changeFileFunc}
            >

                <h5
                    ref={fileNameDisplay}
                >Select file</h5>

                <input
                    ref={fileInput}
                    onChange={fileChangeFunc}
                    className="fileInput"
                    type="file"
                    multiple />

            </label>



            <button
                onClick={fileSendBtnFunc}
                className="FileSendBtn"
            >send</button>
        </div>



        <div className="DownloadFileManage">
            <h5
                className="DownloadFileNameDisplay"
            >File Name</h5>


            <div className="progressBar">
                <div></div>
            </div>

            <div className="BtnsDiv">
                <button
                    onClick={cancelDownloadRequest}
                    className="CancelBtn"
                ><i className="fa fa-remove"></i></button>
                <button
                    onClick={downloadBtnFunc}
                    className="DownloadBtn"><i className="fa fa-download"></i></button>
            </div>
        </div>


    </a>
}