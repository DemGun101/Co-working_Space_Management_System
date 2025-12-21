import { Router } from "express";
import {
  getOrders,
  getGuestRequests,
  getTodayStats,
  completeOrder,
  completeGuestRequest,
  getActiveCustomers,
} from "../controllers/office-boy-controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get('/orders', authMiddleware, getOrders);
router.get('/guests', authMiddleware, getGuestRequests);
router.get('/stats', authMiddleware, getTodayStats);
router.get('/customers/active', authMiddleware, getActiveCustomers);
router.patch('/orders/:id/complete', authMiddleware, completeOrder);
router.patch('/guests/:id/complete', authMiddleware, completeGuestRequest);

export default router;
