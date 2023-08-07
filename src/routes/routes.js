import { Router } from "express";
import { registerUser, loginUser} from "../controllers/userControllers.js";
import { validationSchema } from "../middlewares/validationSchema.js";
import { signInSchema, signUpSchema } from "../schemas/userSchema.js";

const router = Router();

router.post("/signup", validationSchema(signUpSchema), registerUser);
router.post("/signin", validationSchema(signInSchema ), loginUser);

export default router;