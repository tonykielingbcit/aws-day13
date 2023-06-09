import { deleteMessage } from "@chatapp/core/src/database/db-message";

export async function main(event, context) {
    const sub = event.requestContext.authorizer?.jwt.claims.sub;

    try {
      const { id } = event.pathParameters;
      const res = await deleteMessage(id, sub);

      return ({
            statusCode: 200,
            body: JSON.stringify({
                message: res > 0 && true,
                error: res < 1 && true
            }),
        });
    
    } catch(error) {
      console.log("###ERROR on deleteMessage: ", error.message || error);
      return({
        error: true,
        message: "ERROR on deleteMessage"
      });
    }
  }
  