import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userControllers.js";
import { deleteUrl, getUrlById, shortenUrl, visitUrl } from "../controllers/urlControllers.js";
import { validationSchema } from "../middlewares/validationSchema.js";
import { signInSchema, signUpSchema } from "../schemas/userSchema.js";
import { urlSchema } from "../schemas/urlSchema.js";


const router = Router();

router.post("/signup", validationSchema(signUpSchema), registerUser);
router.post("/signin", validationSchema(signInSchema), loginUser);
router.post("/urls/shorten", validationSchema(urlSchema), shortenUrl);
router.get("/urls/:id", getUrlById);
router.get("/urls/open/:shortUrl", visitUrl);
router.delete("/urls/:id", deleteUrl);

export default router;