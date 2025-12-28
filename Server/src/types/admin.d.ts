import { JwtPayload } from 'jsonwebtoken';

export interface AdminJwtPayload extends JwtPayload {
    adminId: string;
    email: string;
    role: 'super-admin' | 'admin';
}

declare global {
    namespace Express {
        interface Request {
            admin?: AdminJwtPayload;
        }
    }
}
