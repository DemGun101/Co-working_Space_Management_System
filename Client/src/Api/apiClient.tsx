import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  //   DELETE: 'DELETE',
} as const;

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const API_ENDPOINTS = {
  AUTH: {
    USER_LOGIN: "/auth/login",
  },
  USER: {
    GET_ME: "/user/me",
    GET_ACTIVITY: "/user/activity",
    TOGGLE_ATTENDANCE: "/user/attendance/toggle",
    CREATE_ORDER: "/user/order",
    REGISTER_GUEST: "/user/guest",
  },
  OFFICE_BOY: {
    GET_ORDERS: "/office-boy/orders",
    GET_GUESTS: "/office-boy/guests",
    GET_STATS: "/office-boy/stats",
    GET_CUSTOMERS: "/office-boy/customers/active",
    COMPLETE_ORDER: (id: string) => `/office-boy/orders/${id}/complete`,
    COMPLETE_GUEST: (id: string) => `/office-boy/guests/${id}/complete`,
  },
};
