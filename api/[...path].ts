import serverless from "serverless-http";
import app from "../artifacts/api-server/src/app";

// Wrap the existing Express `app` as a serverless handler.
const handler = serverless(app as unknown as any);

export default async function (req: any, res: any) {
  return handler(req, res);
}
