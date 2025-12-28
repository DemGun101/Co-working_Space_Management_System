export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'office-boy' | 'admin';
    cabinNumber?: string;
    todayChaiCoffeeUsed: number;
    chaiCoffeeLimit: number;
    isCheckedIn: boolean;
}

export interface LoginResponse {
    token: string;
    user: User;
}