import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "node:crypto";

if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(
  cors({
    origin: "https://attendifyapp.vercel.app",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

import webAuthnRouter from "./routes/webauthn.js";
app.use("/api/v1/passkey", webAuthnRouter);

app.listen(3000, () => console.log("Listening on PORT: 3000"));