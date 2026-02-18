import express from 'express';
import { logout,login,signUp,getUser,updateProfile } from '../controllers/UserController.js';
import isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/signUp',signUp);
router.post('/login',login)
router.post('/logout', logout);
router.get("/me", isAuth, getUser);
// upadte profile
router.put("/profile", isAuth, upload.single("photo"), updateProfile);
export default router;
