import { Router } from "express";
import { getUser, registerUser } from "../controllers/userControllers.js";
import { validationSchema } from "../middlewares/validationSchema.js";
import { userSchema } from "../schemas/userSchema.js";

const router = Router();

router.post("/signup", validationSchema(userSchema), registerUser);
router.get("/signup", getUser);

export default router;