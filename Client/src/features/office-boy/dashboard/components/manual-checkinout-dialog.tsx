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
import { useToggleAttendance } from "@/Api/user";
import { CustomerSelect } from "../../../../components/customer-select";
import { manualCheckInOutSchema, type ManualCheckInOutFormData } from "../schema";

interface ManualCheckInOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManualCheckInOutDialog({ open, onOpenChange }: ManualCheckInOutDialogProps) {
  const queryClient = useQueryClient();
  const { data: customers = [] } = useGetCustomers();
  const toggleAttendance = useToggleAttendance();

  const { control, handleSubmit, reset, watch, setValue } = useForm<ManualCheckInOutFormData>({
    resolver: zodResolver(manualCheckInOutSchema),
    defaultValues: { customerId: "", action: "check-in" },
  });

  const action = watch("action");

  const filteredCustomers = customers.filter((customer) =>
    action === "check-in" ? !customer.isCheckedIn : customer.isCheckedIn
  );

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleActionChange = (newAction: "check-in" | "check-out") => {
    setValue("action", newAction);
    setValue("customerId", "");
  };

  const onSubmit = async (data: ManualCheckInOutFormData) => {
    try {
      await toggleAttendance.mutateAsync({
        customerId: data.customerId,
        action: data.action,
      });
      queryClient.invalidateQueries({ queryKey: officeBoyKeys.getStats });
      queryClient.invalidateQueries({ queryKey: officeBoyKeys.getCustomers });
      onOpenChange(false);
    } catch {
      // Error handled by fetcher
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Check-in/out</DialogTitle>
          <DialogDescription>
            Record attendance on behalf of a customer
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Controller
            name="action"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Action</Label>
                <RadioGroup
                  value={field.value}
                  onValueChange={(v) => handleActionChange(v as "check-in" | "check-out")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="check-in" id="check-in" />
                    <Label htmlFor="check-in" className="font-normal cursor-pointer">
                      Check-in
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="check-out" id="check-out" />
                    <Label htmlFor="check-out" className="font-normal cursor-pointer">
                      Check-out
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          />

          <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
              <CustomerSelect
                value={field.value ?? ""}
                onChange={field.onChange}
                customers={filteredCustomers}
                emptyMessage={`No customers available for ${action}`}
              />
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={toggleAttendance.isPending}>
              {toggleAttendance.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
