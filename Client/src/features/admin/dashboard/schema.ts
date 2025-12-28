import { z } from "zod";

export const addUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["customer", "office-boy"], {
    message: "Please select a role",
  }),
  cabinNumber: z.string().optional(),
  chaiCoffeeLimit: z.coerce.number().min(1, "Limit must be at least 1").default(1),
});

export type AddUserFormData = z.infer<typeof addUserSchema>;
