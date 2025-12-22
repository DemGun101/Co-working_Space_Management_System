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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetCustomers, officeBoyKeys } from "@/Api/office-boy";
import { useRegisterGuest } from "@/Api/user";
import { CustomerSelect } from "../../../../components/customer-select";
import { manualGuestSchema, type ManualGuestFormData } from "../schema";

interface ManualGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManualGuestDialog({ open, onOpenChange }: ManualGuestDialogProps) {
  const queryClient = useQueryClient();
  const { data: customers = [] } = useGetCustomers();
  const registerGuest = useRegisterGuest();

  const { control, handleSubmit, reset } = useForm<ManualGuestFormData>({
    resolver: zodResolver(manualGuestSchema),
    defaultValues: { customerId: "", guestName: "", expectedTime: "" },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: ManualGuestFormData) => {
    try {
      const today = new Date();
      const [hours, minutes] = data.expectedTime.split(":");
      today.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await registerGuest.mutateAsync({
        guestName: data.guestName.trim(),
        expectedTime: today.toISOString(),
        customerId: data.customerId,
      });
      queryClient.invalidateQueries({ queryKey: officeBoyKeys.getGuests });
      queryClient.invalidateQueries({ queryKey: officeBoyKeys.getStats });
      onOpenChange(false);
    } catch {
      // Error handled by fetcher
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Guest Entry</DialogTitle>
          <DialogDescription>
            Register a guest on behalf of a customer
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
            name="guestName"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="guestName">Guest Name</Label>
                <Input
                  id="guestName"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Enter guest name"
                />
              </div>
            )}
          />

          <Controller
            name="expectedTime"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="expectedTime">Expected Time</Label>
                <Input
                  id="expectedTime"
                  type="time"
                  className="w-fit"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </div>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={registerGuest.isPending}>
              {registerGuest.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
