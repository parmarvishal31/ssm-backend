import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller.js";
const router = express.Router();

router.get("/", isLoggedIn, getCategory);
router.post("/", isLoggedIn, createCategory);
router.get("/:id", isLoggedIn, getSingleCategory);
router.put("/:id", isLoggedIn, updateCategory);
router.delete("/:id", isLoggedIn, deleteCategory);

export default router;
