import express from "express";
import { login } from "../controllers/usercontroller/auth.js";
import { AdminLogin } from "../controllers/admincontroller/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/adminlogin",AdminLogin);

export default router;
