import { API_ENDPOINTS, apiClient } from "../apiClient";
import type {
  CompleteGuestResponse,
  CompleteOrderResponse,
  GetGuestsResponse,
  GetOrdersResponse,
  GetStatsResponse,
  GetCustomersResponse,
} from "./types";

export const getOrders = async (): Promise<GetOrdersResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.OFFICE_BOY.GET_ORDERS);
  return response.data;
};

export const getGuests = async (): Promise<GetGuestsResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.OFFICE_BOY.GET_GUESTS);
  return response.data;
};

export const getStats = async (): Promise<GetStatsResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.OFFICE_BOY.GET_STATS);
  return response.data;
};

export const completeOrder = async (
  id: string
): Promise<CompleteOrderResponse> => {
  const response = await apiClient.patch(
    API_ENDPOINTS.OFFICE_BOY.COMPLETE_ORDER(id)
  );
  return response.data;
};

export const completeGuest = async (
  id: string
): Promise<CompleteGuestResponse> => {
  const response = await apiClient.patch(
    API_ENDPOINTS.OFFICE_BOY.COMPLETE_GUEST(id)
  );
  return response.data;
};

export const getCustomers = async (): Promise<GetCustomersResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.OFFICE_BOY.GET_CUSTOMERS);
  return response.data;
};
