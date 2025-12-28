import { useQuery, useMutation } from "@tanstack/react-query";
import { adminKeys } from "./keys";
import {
  getAdminStats,
  getAdminActivity,
  getAdminUsers,
  createUser,
  updateUser,
  deleteUser,
  getFilterOptions,
} from "./fetchers";
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

export const useGetAdminStats = () => {
  return useQuery<AdminStats, Error>({
    queryKey: adminKeys.getStats,
    queryFn: getAdminStats,
  });
};

export const useGetAdminActivity = (params?: GetActivityParams) => {
  return useQuery<GetActivityResponse, Error>({
    queryKey: [...adminKeys.getActivity, params],
    queryFn: () => getAdminActivity(params),
  });
};

export const useGetAdminUsers = (params?: GetUsersParams) => {
  return useQuery<GetUsersResponse, Error>({
    queryKey: [...adminKeys.getUsers, params],
    queryFn: () => getAdminUsers(params),
  });
};

export const useCreateUser = () => {
  return useMutation<CreateUserResponse, Error, CreateUserRequest>({
    mutationKey: adminKeys.createUser,
    mutationFn: createUser,
  });
};

export const useUpdateUser = () => {
  return useMutation<UpdateUserResponse, Error, UpdateUserRequest>({
    mutationKey: adminKeys.updateUser,
    mutationFn: updateUser,
  });
};

export const useDeleteUser = () => {
  return useMutation<DeleteUserResponse, Error, string>({
    mutationKey: adminKeys.deleteUser,
    mutationFn: deleteUser,
  });
};

export const useGetFilterOptions = () => {
  return useQuery<FilterOptionsResponse, Error>({
    queryKey: adminKeys.getFilters,
    queryFn: getFilterOptions,
  });
};
