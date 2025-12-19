import type { User } from '@/Api/auth/types'

// GET /user/me response
export type GetMeResponse = User


// POST /user/attendance/toggle response
export interface ToggleAttendanceResponse {
    message: string
    isCheckedIn: boolean
}

// POST /user/order request
export interface CreateOrderRequest {
    type: 'chai' | 'coffee'
}

// POST /user/order response
export interface CreateOrderResponse {
    message: string
    order: {
        id: string
        customerId: string
        cabinNumber: string
        type: 'chai' | 'coffee'
        status: 'pending' | 'completed'
        requestedAt: string
        addedBy: 'customer' | 'office-boy'
    }
}

// POST /user/guest request
export interface RegisterGuestRequest {
    guestName: string
    expectedTime: string
}

// POST /user/guest response
export interface RegisterGuestResponse {
    message: string
    guest: {
        id: string
        customerId: string
        cabinNumber: string
        guestName: string
        expectedTime: string
        status: 'pending' | 'completed'
        requestedAt: string
        addedBy: 'customer' | 'office-boy'
    }
}

// Guest type for activity
export interface Guest {
    _id: string
    customerId: string
    cabinNumber: string
    guestName: string
    expectedTime: string
    status: 'pending' | 'completed'
    requestedAt: string
    addedBy: 'customer' | 'office-boy'
}

// Attendance type for activity
export interface Attendance {
    checkInTime: string;
    checkOutTime?: string;
}

// Order type for activity
export interface ActivityOrder {
    type: 'chai' | 'coffee';
    requestedAt: string;
}

// GET /user/activity response
export interface GetActivityResponse {
    guests: Guest[];
    attendance: Attendance | null;
    order: ActivityOrder | null;
}