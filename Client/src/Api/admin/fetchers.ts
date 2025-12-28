import axios from "axios";
import { apiClient, API_ENDPOINTS } from "../apiClient";
import { toast } from "sonner";
import type {
  AdminStats,
  GetActivityParams,
  GetActivityResponse,
  GetUsersParams,
  GetUsersResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
  FilterOptionsResponse,
} from "./types";

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.GET_STATS);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to fetch stats";
      toast.error(message);
      throw new Error(message);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getAdminActivity = async (
  params?: GetActivityParams
): Promise<GetActivityResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.GET_ACTIVITY, {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to fetch activity";
      toast.error(message);
      throw new Error(message);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getAdminUsers = async (
  params?: GetUsersParams
): Promise<GetUsersResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.GET_USERS, {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to fetch users";
      toast.error(message);
      throw new Error(message);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createUser = async (
  data: CreateUserRequest
): Promise<CreateUserResponse> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.CREATE_USER, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to create user";
      toast.error(message);
      throw new Error(message);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateUser = async (
  data: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  try {
    const { id, ...updateData } = data;
    const response = await apiClient.patch(
      API_ENDPOINTS.ADMIN.UPDATE_USER(id),
      updateData
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to update user";
      toast.error(message);
      throw new Error(message);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteUser = async (id: string): Promise<DeleteUserResponse> => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.ADMIN.DELETE_USER(id));
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to delete user";
      toast.error(message);
      throw new Error(message);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getFilterOptions = async (): Promise<FilterOptionsResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.GET_FILTERS);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to fetch filter options";
      toast.error(message);
      throw new Error(message);
    }
    throw new Error("An unexpected error occurred");
  }
};
