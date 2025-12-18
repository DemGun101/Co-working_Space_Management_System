import axios from "axios";
import { API_ENDPOINTS, apiClient } from "../apiClient";
import type { LoginRequest,LoginResponse } from "./types";

const USER_LOGIN_URL = API_ENDPOINTS.AUTH.USER_LOGIN

export const login = async ({email, password}: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post(USER_LOGIN_URL,{
            email,password
        })
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);

            if (response.data.user) {
                localStorage.setItem('userData', JSON.stringify(response.data.user));
            }
        }

    return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      // Throw a new Error with just the message you want
      throw new Error(message);
    }

    // Fallback for unexpected errors
    throw new Error('An unexpected error occurred during login.')
    }
}
