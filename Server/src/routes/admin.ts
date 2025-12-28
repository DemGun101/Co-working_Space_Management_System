import { Router } from 'express';
import { adminAuthMiddleware, superAdminOnly } from '../middlewares/admin-auth.middleware';
import {
    registerAdmin,
    loginAdmin,
    getCurrentAdmin,
    forgotPassword,
    resetPassword,
    changePassword
} from '../controllers/admin-auth-controller';
import {
    getFilterOptions,
    getDashboardStats,
    getDashboardActivity
} from '../controllers/admin-dashboard-controller';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/admin-users-controller';

const router = Router();

// ==================== AUTH ROUTES ====================
// Public routes
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes (require admin auth)
router.get('/me', adminAuthMiddleware, getCurrentAdmin);
router.patch('/change-password', adminAuthMiddleware, changePassword);

// Super-admin only route
router.post('/register', adminAuthMiddleware, superAdminOnly, registerAdmin);

// ==================== DASHBOARD ROUTES ====================
router.get('/dashboard/filters', adminAuthMiddleware, getFilterOptions);
router.get('/dashboard/stats', adminAuthMiddleware, getDashboardStats);
router.get('/dashboard/activity', adminAuthMiddleware, getDashboardActivity);

// ==================== USER MANAGEMENT ROUTES ====================
router.get('/users', adminAuthMiddleware, getAllUsers);
router.get('/users/:id', adminAuthMiddleware, getUserById);
router.post('/users', adminAuthMiddleware, createUser);
router.patch('/users/:id', adminAuthMiddleware, updateUser);
router.delete('/users/:id', adminAuthMiddleware, deleteUser);

export default router;
