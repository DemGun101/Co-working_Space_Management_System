import { Router } from "express";
import { getCurrentUser, toggleAttendance, createOrder, registerGuest } from "../controllers/user-controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router()

router.get('/me', authMiddleware, getCurrentUser)
router.patch('/attendance/toggle', authMiddleware, toggleAttendance)
router.post('/order', authMiddleware, createOrder)
router.post('/guest', authMiddleware, registerGuest)


// router.get('/:id', authMiddleware, getUserById)

export default router