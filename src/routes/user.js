import { Router } from "express";
import { addLabel } from "../controllers/user.js";

const router = Router();

router.route("/label").post(addLabel);

export default router;
