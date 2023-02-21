import Express from "express";
import {
  forgetPassword,
  getMyProfile,
  login,
  logOut,
  register,
  resetPassword,
  updatePassword,
  updatepic,
  updateProfile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";

const router = Express.Router();

router.post("/login", login);

router.post("/new", singleUpload, register);

router.get("/me", isAuthenticated, getMyProfile);
router.get("/logout", isAuthenticated, logOut);

//All Update Routes

router.put("/updateprofile", isAuthenticated, updateProfile);
router.put("/changepassword", isAuthenticated, updatePassword);
router.put("/updatepic", isAuthenticated, singleUpload, updatepic);

// Forget Password & Reset Password
router.route("/forgetpassword").post(forgetPassword).put(resetPassword);

export default router;
