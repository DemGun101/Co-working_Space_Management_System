import { JwtPayload } from 'jsonwebtoken';

// Define the structure of our JWT payload
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
