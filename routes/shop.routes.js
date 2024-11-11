import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import upload from "../middlewares/multer.middleware.js";
const router = express.Router();

router.get("/", getCategory);
router.post("/", isLoggedIn, upload.single("img"), createCategory);
router.get("/:id", isLoggedIn, getSingleCategory);
router.put("/:id", isLoggedIn, upload.single("img"), updateCategory);
router.delete("/:id", isLoggedIn, deleteCategory);

export default router;
