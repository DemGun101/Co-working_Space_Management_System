// Login Request
export interface LoginRequest {
    email: string;
    password: string;
}

// User from API
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'office-boy';
    cabinNumber?: string;
    todayChaiCoffeeUsed: number;
    isCheckedIn: boolean;
    lastCheckIn?: string;
    lastCheckOut?: string;
}


// Login Response
export interface LoginResponse {
    token: string;
    user: User;
}