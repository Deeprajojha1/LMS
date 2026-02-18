import express from "express";
import { GoogleAuth} from '../controllers/UserController.js';
const router = express.Router();

// Google Signup / Login
router.post("/google", GoogleAuth);

export default router;
