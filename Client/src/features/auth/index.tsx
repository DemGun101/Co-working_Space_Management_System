import {  useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
 import { useLogin } from "@/Api/auth";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "./schema";
import { useNavigate } from "react-router-dom";



const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      const user = JSON.parse(userData);
      if (user.role === "customer") {
        navigate("/dashboard", { replace: true });
      } else if (user.role === "office-boy") {
        navigate("/office-boy", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin", { replace: true });
      }
    }
  }, [navigate]);

  const { mutate: login, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = (data: LoginFormData) => {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: (res) => {
          toast.success(`Welcome back, ${res.user.name}!`);
          if (res.user.role === "customer") {
            navigate("/dashboard");
          } else if (res.user.role === "office-boy") {
            navigate("/office-boy");
          } else if (res.user.role === "admin") {
            navigate("/admin");
          }
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };



  return (
    <div className="flex h-screen w-full items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src="/timeLapse-logo.svg"
            alt="TimeLapse Logo"
            className="w-20 h-20 mx-auto mb-2"
          />
          <CardTitle className="text-2xl">Welcome to TimeLapse</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            <Button
              type="submit"
              className="w-full mt-4 cursor-pointer"
              disabled={isPending}
            >
              {isPending ? <Spinner /> : "Login"}
            </Button>
          </form>

          
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
