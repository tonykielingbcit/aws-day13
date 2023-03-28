import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";

import App from "./App.jsx";

const amplifyConfig = {
    Auth: {
      mandatorySignIn: false,
      region: import.meta.env.VITE_APP_REGION,
      userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
      userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
      // identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
    },
    API: {
      endpoints: [
        {
          name: "api",
          endpoint: import.meta.env.VITE_APP_API_URL,
          region: import.meta.env.VITE_APP_REGION,
        },
      ],
    },
  };
Amplify.configure(amplifyConfig);

// console.log("amplifyConfig=== ", amplifyConfig)

export default function AppAuthProvider() {
    return (
        <Authenticator.Provider>
            <App />
        </Authenticator.Provider>
    );
}
