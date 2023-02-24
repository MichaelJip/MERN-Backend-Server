import express from "express";
import {
  addCategory,
  addProductImage,
  createProduct,
  deleteCategory,
  deleteProduct,
  deleteProductImage,
  getAdminProduct,
  getAllCategory,
  getAllProduct,
  getProductDetails,
  updateProduct,
} from "../controllers/product.js";
import { isAuthenticated, isAdmin } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.get("/all", getAllProduct);
router.get("/admin", isAuthenticated, isAdmin, getAdminProduct);
router
  .route("/single/:id")
  .get(getProductDetails)
  .put(isAuthenticated, isAdmin, updateProduct)
  .delete(isAuthenticated, isAdmin, deleteProduct);

router.post("/new", isAuthenticated, isAdmin, singleUpload, createProduct);

router
  .route("/images/:id")
  .post(isAuthenticated, isAdmin, singleUpload, addProductImage)
  .delete(isAuthenticated, isAdmin, deleteProductImage);

// For Category
router.post("/category", isAuthenticated, isAdmin, addCategory);

router.get("/categories", getAllCategory);

router.delete("/category/:id", isAuthenticated, isAdmin, deleteCategory);

export default router;
