import { Router } from "express";
import {
  createLoginChallenge,
  createRegisterChallenge,
  test,
  verifyLoginChallenge,
  verifyRegisterChallenge,
} from "../controllers/webauthn.js";

const router = Router();

router.route("/register").post(createRegisterChallenge);
router.route("/verify").post(verifyRegisterChallenge);
router.route("/login").post(createLoginChallenge);
router.route("/verify-login").post(verifyLoginChallenge);

export default router;
