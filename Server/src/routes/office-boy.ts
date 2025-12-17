import { Router } from "express";
import {
  getOrders,
  getGuestRequests,
  getTodayStats,
  completeOrder,
  completeGuestRequest
} from "../controllers/office-boy-controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// GET endpoints
router.get('/orders', authMiddleware, getOrders);
router.get('/guests', authMiddleware, getGuestRequests);
router.get('/stats', authMiddleware, getTodayStats);

// PATCH endpoints for marking complete
router.patch('/orders/:id/complete', authMiddleware, completeOrder);
router.patch('/guests/:id/complete', authMiddleware, completeGuestRequest);

export default router;
