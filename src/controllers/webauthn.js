import { Query } from "node-appwrite";
import { databases } from "../appwrite/config.js";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";

export const test = (req, res) => {
  return res.json({ message: "Hello there" });
};

export const createRegisterChallenge = async (req, res) => {
  try {
    const { userId, category } = req.body;

    if (!userId || !category) {
      return res
        .status(400)
        .json({ message: "User ID and Category are required" });
    }

    const collectionId =
      category === "ORG"
        ? process.env.APPWRITE_ORG_COLLECTION_ID
        : process.env.APPWRITE_STD_COLLECTION_ID;

    const userDoc = await databases.listDocuments(
      process.env.APPWRITE_DB_ID,
      collectionId,
      [Query.equal("$id", [userId])]
    );

    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const options = await generateRegistrationOptions({
      rpID: "attendifyapp.vercel.app",
      rpName: "Attendify",
      userName:
        category === "ORG"
          ? userDoc.documents[0].name
          : `${userDoc.documents[0].firstName} ${userDoc.documents[0].lastName}`,
    });

    console.log(options.challenge);

    const updatedUserDoc = await databases.updateDocument(
      process.env.APPWRITE_DB_ID,
      category === "ORG"
        ? process.env.APPWRITE_ORG_COLLECTION_ID
        : process.env.APPWRITE_STD_COLLECTION_ID,
      userDoc.documents[0].$id,
      {
        challenge: options.challenge,
      }
    );
    if (!updatedUserDoc) {
      return res.status(500).json({
        message: "Something went wrong while saving challenge to database ",
      });
    }

    return res
      .status(200)
      .json({ message: "Challenge created successfully", options });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Error occured" });
  }
};

export const verifyRegisterChallenge = async (req, res) => {
  const { userId, credential, category } = req.body;

  if (!userId || !credential || !category) {
    return res
      .status(400)
      .json({ message: "UserId, credential and challenge are required" });
  }

  const userDoc = await databases.listDocuments(
    process.env.APPWRITE_DB_ID,
    category === "ORG"
      ? process.env.APPWRITE_ORG_COLLECTION_ID
      : process.env.APPWRITE_STD_COLLECTION_ID,
    [Query.equal("$id", [userId])]
  );

  if (!userDoc) {
    return res.status(404).json({ message: "User not found" });
  }

  const challenge = userDoc.documents[0].challenge;

  const verificationResult = await verifyRegistrationResponse({
    expectedChallenge: challenge,
    expectedOrigin: "https://attendifyapp.vercel.app",
    expectedRPID: "attendify.vercel.app",
    response: credential,
  });

  if (!verificationResult.verified) {
    return res.status(401).json({ message: "Verification failed" });
  }

  const cpkNumArr = Array.from(
    verificationResult.registrationInfo.credentialPublicKey
  );
  const aoNumArr = Array.from(
    verificationResult.registrationInfo.attestationObject
  );

  const passKey = {
    ...verificationResult.registrationInfo,
    credentialPublicKey: cpkNumArr,
    attestationObject: aoNumArr,
  };

  const updatedUserDoc = await databases.updateDocument(
    process.env.APPWRITE_DB_ID,
    category === "ORG"
      ? process.env.APPWRITE_ORG_COLLECTION_ID
      : process.env.APPWRITE_STD_COLLECTION_ID,
    userDoc.documents[0].$id,
    {
      passKey: JSON.stringify(passKey),
      challenge: null,
    }
  );
  if (!updatedUserDoc) {
    return res.status(500).json({
      message: "Something went wrong while saving challenge to database ",
    });
  }

  return res.status(200).json({ message: "Verified!", verificationResult });
};

export const createLoginChallenge = async (req, res) => {
  const { userId, category } = req.body;

  if (!userId || !category) {
    return res
      .status(400)
      .json({ message: "UserId and Category are required" });
  }

  const userDoc = await databases.listDocuments(
    process.env.APPWRITE_DB_ID,
    category === "ORG"
      ? process.env.APPWRITE_ORG_COLLECTION_ID
      : process.env.APPWRITE_STD_COLLECTION_ID,
    [Query.equal("$id", [userId])]
  );

  if (!userDoc) {
    return res.status(404).json({ message: "User not found" });
  }

  const options = await generateAuthenticationOptions({
    rpID: "attendify.vercel.app",
  });

  const updatedUserDoc = await databases.updateDocument(
    process.env.APPWRITE_DB_ID,
    category === "ORG"
      ? process.env.APPWRITE_ORG_COLLECTION_ID
      : process.env.APPWRITE_STD_COLLECTION_ID,
    userDoc.documents[0].$id,
    {
      challenge: options.challenge,
    }
  );
  if (!updatedUserDoc) {
    return res.status(500).json({
      message: "Something went wrong while saving challenge to database ",
    });
  }

  return res.status(200).json({ options });
};

export const verifyLoginChallenge = async (req, res) => {
  try {
    const { userId, cred, category } = req.body;

    if (!userId || !cred || !category) {
      return res
        .status(400)
        .json({ message: "UserId, cred and category are required" });
    }

    const userDoc = await databases.listDocuments(
      process.env.APPWRITE_DB_ID,
      category === "ORG"
        ? process.env.APPWRITE_ORG_COLLECTION_ID
        : process.env.APPWRITE_STD_COLLECTION_ID,
      [Query.equal("$id", [userId])]
    );

    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const challenge = userDoc.documents[0].challenge;
    const authenticator = JSON.parse(userDoc.documents[0].passKey);

    const decryptedAuthenticator = {
      ...authenticator,
      credentialPublicKey: new Uint8Array(authenticator.credentialPublicKey),
      attestationObject: new Uint8Array(authenticator.attestationObject),
    };

    const verificationResult = await verifyAuthenticationResponse({
      expectedChallenge: challenge,
      expectedOrigin: "https://attendifyapp.vercel.app",
      expectedRPID: "attendify.vercel.app",
      response: cred,
      authenticator: decryptedAuthenticator,
    });

    if (!verificationResult.verified) {
      return res.status(401).json({ message: "Verification failed" });
    }

    await databases.updateDocument(
      process.env.APPWRITE_DB_ID,
      category === "ORG"
        ? process.env.APPWRITE_ORG_COLLECTION_ID
        : process.env.APPWRITE_STD_COLLECTION_ID,
      userDoc.documents[0].$id,
      {
        challenge: null,
      }
    );

    return res.status(200).json({ message: "Verified", verifcation: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
