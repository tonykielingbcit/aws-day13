import { deleteChat } from "@chatapp/core/src/database/db-chat";

export async function main(event, context) {
    const sub = event.requestContext.authorizer?.jwt.claims.sub;

    try {
      const { id } = event.pathParameters;
      await deleteChat(id, sub);
    
      return ({
        statusCode: 200,
        body: JSON.stringify({
          message: "from delete"
        }),
      });
    } catch(error) {
      console.log("###ERROR on deleteChat: ", error.message || error);
      return({
        error: true,
        message: "ERROR on deleteChat"
      });
    }
  }
  