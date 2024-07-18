import AWS from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint: "https://API_ID.execute-api.ap-northeast-1.amazonaws.com/dev/",
});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId;

  try {
    if (!connectionId) {
      return { statusCode: 400, body: "Missing connection ID." };
    }

    const body = JSON.parse(event.body || "{}");
    const action = body.action;
    const message = body.message || "";

    if (action === "chatMessage") {
      const params = {
        ConnectionId: connectionId,
        Data: `Echo: ${message}`,
      };

      await apigatewaymanagementapi.postToConnection(params).promise();
      return { statusCode: 200, body: "Message sent." };
    } else {
      return { statusCode: 400, body: "Unknown action." };
    }
  } catch (error) {
    console.error("Error handling message:", error);
    return { statusCode: 500, body: "Failed to handle message." };
  }
};
