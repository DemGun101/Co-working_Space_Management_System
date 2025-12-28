import type { User } from '@/Api/auth/types'

export type GetMeResponse = User


export interface ToggleAttendanceRequest {
    customerId?: string
    action?: 'check-in' | 'check-out'
}

export interface ToggleAttendanceResponse {
    message: string
    isCheckedIn: boolean
}

export interface CreateOrderRequest {
    type: 'chai' | 'coffee'
    customerId?: string  // office-boy can specify customer
}

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

export interface RegisterGuestRequest {
    guestName: string
    expectedTime: string
    customerId?: string  // office-boy can specify customer
}

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

export interface Attendance {
    checkInTime: string;
    checkOutTime?: string;
}

export interface ActivityOrder {
    type: 'chai' | 'coffee';
    requestedAt: string;
}

export interface GetActivityResponse {
    guests: Guest[];
    attendance: Attendance | null;
    order: ActivityOrder | null;
}
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}
