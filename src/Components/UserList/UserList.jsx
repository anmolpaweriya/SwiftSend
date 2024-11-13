

// css
import "./UserList.css"





// Components
import ConnectedUser from "./ConnectedUser";










//  custom hooks
import { useConnectedUserList } from "../../CustomHooks/useConnectedUser";









export default function UserList() {

    const connectedUserList = useConnectedUserList();






    // functions










    return <div className="UserListDiv">

        {Object.values(connectedUserList).map((user, index) => <ConnectedUser
            key={index}
            user={user}
        />
        )}

    </div>
}