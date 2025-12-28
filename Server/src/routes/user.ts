import { Router } from "express";
import { getCurrentUser, toggleAttendance, createOrder, registerGuest, getActivity, changePassword } from "../controllers/user-controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router()

router.get('/me', authMiddleware, getCurrentUser)
router.get('/activity', authMiddleware, getActivity)
router.patch('/attendance/toggle', authMiddleware, toggleAttendance)
router.post('/order', authMiddleware, createOrder)
router.post('/guest', authMiddleware, registerGuest)
router.patch('/change-password', authMiddleware, changePassword)


// router.get('/:id', authMiddleware, getUserById)

export default router
