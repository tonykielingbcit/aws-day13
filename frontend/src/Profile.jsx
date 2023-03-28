import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";
// import { Authenticator } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";

export default function Profile() {
    const { user, signOut } = useAuthenticator((context) => [context.user]);
// console.log("user- ", user)

    // const leave = () => {
    //     const onLeaveAppMsg = onLeaveApp();
    //     console.log("leavingggggggggggg", onLeaveAppMsg)
    //     // return <Navigate to="/" />;

    //     // signOut();
    // };

    // console.log("userrrrrrr: ", user)
    if (!user)
        return <Navigate to="/" />;

    return (
            <div>
                {user &&
                    <>
                        <p className="text-2xl font-bold flex justify-center mt-8">Profile</p>
                        <p className="ml-8 text-lg font-bold">User: {user.username}</p>
                        <p className="ml-8 text-lg font-bold">Email: {user.attributes.email}</p>
                        <button 
                            className="w-32 mt-4 ml-8 border-2 bg-red-500 rounded-md p-2 hover:font-bold"
                            onClick={signOut}
                            // onClick={leave}
                            // onClick={onLeaveApp}
                            title="Close Session"
                        >
                            Sign Out
                        </button>
                    </>
                }
            </div>
    );

}