import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetCustomers, officeBoyKeys } from "@/Api/office-boy";
import { useCreateOrder } from "@/Api/user";
import { CustomerSelect } from "../../../../components/customer-select";
import { manualOrderSchema, type ManualOrderFormData } from "../schema";

interface ManualOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManualOrderDialog({ open, onOpenChange }: ManualOrderDialogProps) {
  const queryClient = useQueryClient();
  const { data: customers = [] } = useGetCustomers();
  const createOrder = useCreateOrder();

  const { control, handleSubmit, reset, watch } = useForm<ManualOrderFormData>({
    resolver: zodResolver(manualOrderSchema),
    defaultValues: { customerId: "", orderType: "chai" },
  });

  const customerId = watch("customerId");
  const selectedCustomer = customers.find((c) => c._id === customerId);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: ManualOrderFormData) => {
    try {
      await createOrder.mutateAsync({
        type: data.orderType,
        customerId: data.customerId,
      });
      queryClient.invalidateQueries({ queryKey: officeBoyKeys.getOrders });
      queryClient.invalidateQueries({ queryKey: officeBoyKeys.getStats });
      onOpenChange(false);
    } catch {
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Order Entry</DialogTitle>
          <DialogDescription>
            Create a chai/coffee order on behalf of a customer
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
              <CustomerSelect
                value={field.value ?? ""}
                onChange={field.onChange}
                customers={customers}
              />
            )}
          />

          <Controller
            name="orderType"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Order Type</Label>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="chai" id="chai" />
                    <Label htmlFor="chai" className="font-normal cursor-pointer">
                      Chai
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coffee" id="coffee" />
                    <Label htmlFor="coffee" className="font-normal cursor-pointer">
                      Coffee
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          />

          {selectedCustomer && (
            <p className="text-sm text-muted-foreground">
              Note: This will use their daily allowance (
              {selectedCustomer.todayChaiCoffeeUsed}/1)
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createOrder.isPending}>
              {createOrder.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
