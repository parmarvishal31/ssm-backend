import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { createCategory, getCategory } from "../controllers/category.controller.js";
const router = express.Router();

router.get("/", isLoggedIn, getCategory);
router.post("/",isLoggedIn, createCategory);

export default router;