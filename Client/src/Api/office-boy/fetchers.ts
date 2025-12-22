import axios from "axios";
import { API_ENDPOINTS, apiClient } from "../apiClient";
import type {
  CompleteGuestResponse,
  CompleteOrderResponse,
  GetGuestsResponse,
  GetOrdersResponse,
  GetStatsResponse,
  GetCustomersResponse,
} from "./types";
import { toast } from "sonner";

export const getOrders = async (): Promise<GetOrdersResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.OFFICE_BOY.GET_ORDERS);
    toast.success(response.data.message);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    }
    throw error;
  }
};

export const getGuests = async (): Promise<GetGuestsResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.OFFICE_BOY.GET_GUESTS);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    }
    throw error;
  }
};

export const getStats = async (): Promise<GetStatsResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.OFFICE_BOY.GET_STATS);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    }
    throw error;
  }
};

export const completeOrder = async (
  id: string
): Promise<CompleteOrderResponse> => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.OFFICE_BOY.COMPLETE_ORDER(id)
    );
    toast.success(response.data.message);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    }
    throw error;
  }
};

export const completeGuest = async (
  id: string
): Promise<CompleteGuestResponse> => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.OFFICE_BOY.COMPLETE_GUEST(id)
    );
    toast.success(response.data.message);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    }
    throw error;
  }
};

export const getCustomers = async (): Promise<GetCustomersResponse> => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.OFFICE_BOY.GET_CUSTOMERS
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    }
    throw error;
  }
};
