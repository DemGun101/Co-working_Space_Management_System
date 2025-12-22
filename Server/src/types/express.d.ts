import { JwtPayload } from 'jsonwebtoken';

export interface UserJwtPayload extends JwtPayload {
    userId: string;
    email: string;
    role: 'customer' | 'office-boy';
}

declare global {
    namespace Express {
        interface Request {
            user?: string | UserJwtPayload;
        }
    }
}
