import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models';
import { generateResetToken, verifyResetToken, invalidateToken } from '../services/password-reset.service';

// POST /admin/register - Create new admin (super-admin only)
export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, role } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Admin with this email already exists' });
        }

        // Create admin with null password (requires password reset)
        const admin = await Admin.create({
            name,
            email,
            password: null,
            role: role || 'admin'
        });

        // Generate reset token for new admin to set password
        const resetToken = await generateResetToken(admin._id);

        res.status(201).json({
            message: 'Admin created successfully. Use the reset token to set password.',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            resetToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// POST /admin/login - Admin login, returns JWT
export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if password is set
        if (!admin.password) {
            return res.status(403).json({
                message: 'Password not set. Please reset your password first.',
                requiresPasswordReset: true
            });
        }

        // Compare passwords
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                adminId: admin._id.toString(),
                email: admin.email,
                role: admin.role
            },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// GET /admin/me - Get current admin profile
export const getCurrentAdmin = async (req: Request, res: Response) => {
    try {
        const adminId = req.admin?.adminId;

        const admin = await Admin.findById(adminId).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// POST /admin/forgot-password - Generate reset token (by email)
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            // Return success even if not found (security best practice)
            return res.status(200).json({ message: 'If the email exists, a reset token has been generated' });
        }

        const resetToken = await generateResetToken(admin._id);

        res.status(200).json({
            message: 'Reset token generated successfully',
            resetToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// POST /admin/reset-password/:token - Reset password with token
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Verify token
        const { valid, adminId } = await verifyResetToken(token);
        if (!valid || !adminId) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update password
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.password = newPassword; // Will be hashed by pre-save hook
        await admin.save();

        // Invalidate the token
        await invalidateToken(token);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// PATCH /admin/change-password - Change password (logged in admin)
export const changePassword = async (req: Request, res: Response) => {
    try {
        const adminId = req.admin?.adminId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Verify current password
        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        admin.password = newPassword; // Will be hashed by pre-save hook
        await admin.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
