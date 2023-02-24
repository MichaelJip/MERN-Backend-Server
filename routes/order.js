import express from "express";
import {
  createOrder,
  getAdminOrder,
  getMyOrders,
  getOderDetails,
  processOrder,
  processPayment,
} from "../controllers/order.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, createOrder);
router.post("/payment", isAuthenticated, processPayment);

router.get("/my", isAuthenticated, getMyOrders);
router.get("/admin", isAuthenticated, isAdmin, getAdminOrder);

router
  .route("/single/:id")
  .get(isAuthenticated, getOderDetails)
  .put(isAuthenticated, isAdmin, processOrder);

export default router;
