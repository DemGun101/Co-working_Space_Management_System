import { useQuery, useMutation } from '@tanstack/react-query'
import { userKeys } from './keys'
import { getMe, toggleAttendance, createOrder, registerGuest, getActivity } from './fetchers'
import type {
    GetMeResponse,
    ToggleAttendanceRequest,
    ToggleAttendanceResponse,
    CreateOrderRequest,
    CreateOrderResponse,
    RegisterGuestRequest,
    RegisterGuestResponse,
    GetActivityResponse,
} from './types'

export const useGetMe = () => {
    return useQuery<GetMeResponse, Error>({
        queryKey: userKeys.getMe,
        queryFn: getMe,
    })
}

export const useToggleAttendance = () => {
    return useMutation<ToggleAttendanceResponse, Error, ToggleAttendanceRequest | undefined>({
        mutationKey: userKeys.toggleAttendance,
        mutationFn: toggleAttendance,
    })
}

export const useCreateOrder = () => {
    return useMutation<CreateOrderResponse, Error, CreateOrderRequest>({
        mutationKey: userKeys.createOrder,
        mutationFn: createOrder,
    })
}

export const useRegisterGuest = () => {
    return useMutation<RegisterGuestResponse, Error, RegisterGuestRequest>({
        mutationKey: userKeys.registerGuest,
        mutationFn: registerGuest,
    })
}

export const useGetActivity = () => {
    return useQuery<GetActivityResponse, Error>({
        queryKey: userKeys.getActivity,
        queryFn: getActivity,
    })
}
