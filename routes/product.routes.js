import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
const router = express.Router();

router.get("/", getProducts);
router.post("/", isLoggedIn, upload.single("img"), createProduct);
router.get("/:id", isLoggedIn, getSingleProduct);
router.put("/:id", isLoggedIn, upload.single("img"), updateProduct);
router.delete("/:id", isLoggedIn, deleteProduct);

export default router;
