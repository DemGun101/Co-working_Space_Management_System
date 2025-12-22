import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Briefcase, ArrowLeft } from "lucide-react";
import { useLogin } from "@/Api/auth";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "./schema";
import { useNavigate } from "react-router-dom";
type UserType = "customer" | "office-boy" | null;

const dummyUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@workspace.com",
    password: "password123",
    role: "customer",
  },
  {
    id: "2",
    name: "Sara Ali",
    email: "sara@workspace.com",
    password: "password123",
    role: "customer",
  },
  {
    id: "3",
    name: "Ahmed Khan",
    email: "ahmed@workspace.com",
    password: "password123",
    role: "customer",
  },
  {
    id: "4",
    name: "Shahid",
    email: "shahid@workspace.com",
    password: "password123",
    role: "office-boy",
  },
];

const Auth = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      const user = JSON.parse(userData);
      navigate(user.role === "customer" ? "/dashboard" : "/office-boy", {
        replace: true,
      });
    }
  }, [navigate]);

  const { mutate: login, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const handleBack = () => {
    setUserType(null);
    reset();
  };

  const handleLogin = (data: LoginFormData) => {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: (res) => {
          toast.success(`Welcome back, ${res.user.name}!`);
          if (res.user.role === "customer") {
            navigate("/dashboard");
          } else {
            navigate("/office-boy");
          }
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const filteredUsers = dummyUsers.filter((user) => user.role === userType);

  if (!userType) {
    return (
      <div className="flex flex-col md:flex-row h-screen w-full items-center justify-center gap-6 px-6 md:px-20 lg:px-80">
        <Button
          variant="welcome"
          size="xl"
          className="flex-col w-full md:flex-1 md:w-auto"
          onClick={() => setUserType("customer")}
        >
          Customer
          <User className="size-24 md:size-44" strokeWidth={1} />
        </Button>
        <Button
          variant="welcome"
          size="xl"
          className="flex-col w-full md:flex-1 md:w-auto"
          onClick={() => setUserType("office-boy")}
        >
          Office Boy
          <Briefcase className="size-24 md:size-44" strokeWidth={1} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 cursor-pointer"
            onClick={handleBack}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
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

          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground mb-2">Demo Users:</p>
            <div className="flex flex-col gap-1">
              {filteredUsers.map((user) => (
                <p key={user.id} className="text-xs text-muted-foreground">
                  {user.email} / {user.password}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
