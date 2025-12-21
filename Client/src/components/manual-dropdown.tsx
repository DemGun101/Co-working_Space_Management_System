import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ManualOrderDialog } from "@/features/office-boy/dashboard/components/manual-order-dialog";
import { ManualGuestDialog } from "@/features/office-boy/dashboard/components/manual-guest-dialog";
import { ManualCheckInOutDialog } from "@/features/office-boy/dashboard/components/manual-checkinout-dialog";

const ManualDropdown = () => {
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [checkInOutDialogOpen, setCheckInOutDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            Manual Entry
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setOrderDialogOpen(true)}
          >
            Add Chai/Coffee Order
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setGuestDialogOpen(true)}
          >
            Add Guest Entry
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setCheckInOutDialogOpen(true)}
          >
            Manual Check-in/out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ManualOrderDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
      />
      <ManualGuestDialog
        open={guestDialogOpen}
        onOpenChange={setGuestDialogOpen}
      />
      <ManualCheckInOutDialog
        open={checkInOutDialogOpen}
        onOpenChange={setCheckInOutDialogOpen}
      />
    </>
  );
};

export default ManualDropdown;
