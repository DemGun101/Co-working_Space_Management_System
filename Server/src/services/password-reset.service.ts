import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { PasswordResetToken } from '../models';
import { Types } from 'mongoose';

const TOKEN_EXPIRY_HOURS = 1;
const SALT_ROUNDS = 10;

// Generate a reset token, save hashed version to DB, return raw token
export const generateResetToken = async (adminId: Types.ObjectId | string): Promise<string> => {
    // Generate random token
    const rawToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing
    const hashedToken = await bcrypt.hash(rawToken, SALT_ROUNDS);

    // Set expiry time (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

    // Invalidate any existing tokens for this admin
    await PasswordResetToken.updateMany(
        { adminId, isUsed: false },
        { isUsed: true }
    );

    // Save new token
    await PasswordResetToken.create({
        adminId,
        token: hashedToken,
        expiresAt,
        isUsed: false
    });

    return rawToken;
};

// Verify if token is valid and not expired
export const verifyResetToken = async (rawToken: string): Promise<{ valid: boolean; adminId?: Types.ObjectId }> => {
    // Find all non-expired, unused tokens
    const tokens = await PasswordResetToken.find({
        isUsed: false,
        expiresAt: { $gt: new Date() }
    });

    // Check each token (since we store hashed tokens)
    for (const tokenDoc of tokens) {
        const isMatch = await bcrypt.compare(rawToken, tokenDoc.token);
        if (isMatch) {
            return { valid: true, adminId: tokenDoc.adminId };
        }
    }

    return { valid: false };
};

// Mark token as used
export const invalidateToken = async (rawToken: string): Promise<boolean> => {
    const tokens = await PasswordResetToken.find({
        isUsed: false,
        expiresAt: { $gt: new Date() }
    });

    for (const tokenDoc of tokens) {
        const isMatch = await bcrypt.compare(rawToken, tokenDoc.token);
        if (isMatch) {
            tokenDoc.isUsed = true;
            await tokenDoc.save();
            return true;
        }
    }

    return false;
};
