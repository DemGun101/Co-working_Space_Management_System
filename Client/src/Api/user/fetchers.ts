import { API_ENDPOINTS, apiClient } from '../apiClient'
import { toast } from 'sonner'
import axios from 'axios'
import type {
    GetMeResponse,
    ToggleAttendanceResponse,
    CreateOrderRequest,
    CreateOrderResponse,
    RegisterGuestRequest,
    RegisterGuestResponse,
} from './types'

export const getMe = async (): Promise<GetMeResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ME)
    return response.data
}

export const toggleAttendance = async (): Promise<ToggleAttendanceResponse> => {
    try {
        const response = await apiClient.patch(API_ENDPOINTS.USER.TOGGLE_ATTENDANCE)
        toast.success(response.data.message)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message )
        }
        throw error
    }
}

export const createOrder = async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    try {
        const response = await apiClient.post(API_ENDPOINTS.USER.CREATE_ORDER, data)
        toast.success(response.data.message)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message )
        }
        throw error
    }
}

export const registerGuest = async (data: RegisterGuestRequest): Promise<RegisterGuestResponse> => {
    try {
        const response = await apiClient.post(API_ENDPOINTS.USER.REGISTER_GUEST, data)
        toast.success(response.data.message)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message )
        }
        throw error
    }
}
