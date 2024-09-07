import { Router } from "express";
import {
  login,
  logout,
  profile,
  register,
  //   forgotPassword,
  //   resetPassword,
  //   changePassword,
  updateProfile,
  allUser,
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/all-users", allUser);
router.get("/me", isLoggedIn, profile);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:resetToken", resetPassword);
// router.post("/change-password", isLoggedIn, changePassword);
router.put("/update", isLoggedIn, upload.single("avatar"), updateProfile);

export default router;
