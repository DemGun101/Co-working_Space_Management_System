import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminJwtPayload } from '../types/admin';
import { UserJwtPayload } from '../types/express';

// Combined type for admin tokens (could be from Admin model or User model with admin role)
type CombinedAdminPayload = AdminJwtPayload | (UserJwtPayload & { role: 'admin' });

// Verify admin JWT token and attach admin to request
// Accepts both Admin model tokens (adminId) and User model tokens with role='admin' (userId)
export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as CombinedAdminPayload;

        // Check if it's an Admin model token (has adminId)
        if ('adminId' in decoded && decoded.adminId) {
            req.admin = decoded as AdminJwtPayload;
            return next();
        }

        // Check if it's a User model token with admin role (has userId and role='admin')
        if ('userId' in decoded && decoded.role === 'admin') {
            // Convert to AdminJwtPayload format for consistency
            req.admin = {
                adminId: decoded.userId,
                email: decoded.email,
                role: 'admin'
            };
            return next();
        }

        return res.status(401).json({ message: "Invalid admin token" });
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Check if admin has super-admin role
export const superAdminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.admin?.role !== 'super-admin') {
        return res.status(403).json({ message: 'Access denied. Super-admin only.' });
    }
    next();
};
