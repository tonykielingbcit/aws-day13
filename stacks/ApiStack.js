import { Api, Cognito } from "sst/constructs";

export function API({ stack }) {
  // Create auth provider
  const auth = new Cognito(stack, "Auth", {
    login: ["email", "username"],
  });

  const api = new Api(stack, "api", {
    authorizers: {
        jwt: {
          type: "user_pool",
          userPool: {
            id: auth.userPoolId,
            clientIds: [auth.userPoolClientId],
          },
        },
      },
      defaults: {
        authorizer: "jwt",
        function: {
            environment: {
              DATABASE_URL: process.env.DATABASE_URL,
            },
          },
      },
    routes: {
      "GET /chats": {
          function: "packages/functions/src/chat/get.main",
          authorizer: "none"
      },
      "POST /newChat": "packages/functions/src/chat/add.main", 
      "DELETE /chat/{id}": "packages/functions/src/chat/delete.main", 
      "PUT /chat": "packages/functions/src/chat/update.main", 
    //   "GET /messages/{chatId}": "packages/functions/src/message/get.main",
      "GET /messages/{chatId}": {
        function: "packages/functions/src/message/get.main",
        authorizer: "none"
      },
      "POST /newMessage": "packages/functions/src/message/add.main", 
      "DELETE /message/{id}": "packages/functions/src/message/delete.main", 
      "PUT /message": "packages/functions/src/message/update.main"
    },
  });
  
    // Allow authenticated users invoke API
    auth.attachPermissionsForAuthUsers(stack, [api]);

    stack.addOutputs({
        ApiEndpoint: api.url,
        UserPoolId: auth.userPoolId,
        IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
        UserPoolClientId: auth.userPoolClientId,
    });
    
  return { api, auth };
}
