import { useEffect } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addUserSchema, type AddUserFormData } from "../schema";
import { useCreateUser, adminKeys } from "@/Api/admin";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserDialog = ({ open, onOpenChange }: AddUserDialogProps) => {
  const queryClient = useQueryClient();
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema) as Resolver<AddUserFormData>,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "customer",
      cabinNumber: "",
      chaiCoffeeLimit: 1,
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: AddUserFormData) => {
    try {
      await createUser.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        cabinNumber: data.cabinNumber,
        chaiCoffeeLimit: data.chaiCoffeeLimit,
      });
      queryClient.invalidateQueries({ queryKey: adminKeys.getUsers });
      queryClient.invalidateQueries({ queryKey: adminKeys.getActivity });
      onOpenChange(false);
    } catch {
      // Error handled in fetcher
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter name"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="office-boy">Office Boy</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <span className="text-red-500 text-sm">{errors.role.message}</span>
            )}
          </div>

          {selectedRole === "customer" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cabinNumber">Cabin Number</Label>
                <Input
                  id="cabinNumber"
                  placeholder="Enter cabin number"
                  {...register("cabinNumber")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chaiCoffeeLimit">Chai/Coffee Limit (per day)</Label>
                <Input
                  id="chaiCoffeeLimit"
                  type="number"
                  min={1}
                  placeholder="Enter daily limit"
                  {...register("chaiCoffeeLimit")}
                />
                {errors.chaiCoffeeLimit && (
                  <span className="text-red-500 text-sm">
                    {errors.chaiCoffeeLimit.message}
                  </span>
                )}
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
