import { useMutation } from "@tanstack/react-query"
import type{ LoginRequest,  LoginResponse } from "./types"
import { userKeys } from "./keys"
import { login } from "./fetchers"


export const useLogin = () =>{
    return useMutation<LoginResponse,Error,LoginRequest>({
        mutationKey:userKeys.login,
        mutationFn:login,
    })
}