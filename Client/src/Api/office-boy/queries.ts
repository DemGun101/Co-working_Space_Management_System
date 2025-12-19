import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  GetStatsResponse,
  GetGuestsResponse,
  GetOrdersResponse,
  CompleteOrderResponse,
  CompleteGuestResponse,
} from "./types";
import { officeBoyKeys } from "./keys";
import { completeGuest,completeOrder, getGuests, getOrders, getStats } from "./fetchers";

export const useGetOrders = () => {
  return useQuery<GetOrdersResponse, Error>({
    queryKey: officeBoyKeys.getOrders,
    queryFn: getOrders,
  });
};

export const useGetGuests = () => {
  return useQuery<GetGuestsResponse, Error>({
    queryKey: officeBoyKeys.getGuests,
    queryFn: getGuests,
  });
};

export const useGetStats = () => {
  return useQuery<GetStatsResponse, Error>({
    queryKey: officeBoyKeys.getStats,
    queryFn: getStats,
  });
};

export const useCompleteOrder = () => {
  return useMutation<CompleteOrderResponse, Error, string>({
    mutationKey: officeBoyKeys.completeOrder,
    mutationFn: completeOrder,
  });
};

export const useCompleteGuest = () => {
  return useMutation<CompleteGuestResponse, Error, string>({
    mutationKey: officeBoyKeys.completeGuest,
    mutationFn: completeGuest,
  });
};
