import Router from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyTokenOrUser } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerController
);
router.route("/login").post(loginController);

// secured Route

router.route("/logout").post(verifyTokenOrUser,logoutController)

export default router;
