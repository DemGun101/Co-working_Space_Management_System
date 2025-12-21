import { z } from "zod";

export const manualOrderSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  orderType: z.enum(["chai", "coffee"]),
});

export type ManualOrderFormData = z.infer<typeof manualOrderSchema>;

export const manualGuestSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  guestName: z.string().min(1, "Please enter guest name"),
  expectedTime: z.string().min(1, "Please select expected time"),
});

export type ManualGuestFormData = z.infer<typeof manualGuestSchema>;

export const manualCheckInOutSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  action: z.enum(["check-in", "check-out"]),
});

export type ManualCheckInOutFormData = z.infer<typeof manualCheckInOutSchema>;
