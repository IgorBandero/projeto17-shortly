import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userControllers.js";
import { shortenUrl } from "../controllers/urlControllers.js";
import { validationSchema } from "../middlewares/validationSchema.js";
import { signInSchema, signUpSchema } from "../schemas/userSchema.js";
import { urlSchema } from "../schemas/urlSchema.js";


const router = Router();

router.post("/signup", validationSchema(signUpSchema), registerUser);
router.post("/signin", validationSchema(signInSchema), loginUser);
router.post("/urls/shorten", validationSchema(urlSchema), shortenUrl);

export default router;