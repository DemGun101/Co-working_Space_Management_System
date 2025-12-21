import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Customer } from "@/Api/office-boy";

interface CustomerSelectProps {
  value: string;
  onChange: (value: string) => void;
  customers: Customer[];
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
}

export function CustomerSelect({
  value,
  onChange,
  customers,
  placeholder = "Select a customer",
  emptyMessage,
  label = "Customer",
}: CustomerSelectProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {customers.length === 0 && emptyMessage ? (
            <div className="py-2 px-3 text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            customers.map((customer) => (
              <SelectItem key={customer._id} value={customer._id}>
                Cabin {customer.cabinNumber} ({customer.name})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
