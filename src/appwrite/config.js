import sdk from "node-appwrite";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const client = new sdk.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

export const users = new sdk.Users(client);
export const databases = new sdk.Databases(client);
