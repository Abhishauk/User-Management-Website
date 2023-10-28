import express from "express";
import { getallUser , DeleteUser , BlockUnblock ,SearchUser} from "../controllers/admincontroller/auth.js";
import { verifyToken } from "../middleware/auth.js";



const router = express.Router();

router.get("/userlist",verifyToken, getallUser)
router.post("/deleteuser",verifyToken , DeleteUser)
router.post("/blockuser",verifyToken , BlockUnblock)
router.post("/searchuser",verifyToken, SearchUser)

export default router;

