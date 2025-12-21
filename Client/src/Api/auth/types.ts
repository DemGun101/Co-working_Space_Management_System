export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'office-boy';
    cabinNumber?: string;
    todayChaiCoffeeUsed: number;
    isCheckedIn: boolean;
}

export interface LoginResponse {
    token: string;
    user: User;
}