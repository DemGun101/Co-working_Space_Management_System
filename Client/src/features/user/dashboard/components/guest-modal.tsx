import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface GuestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { guestName: string; expectedTime: string }) => void;
}

const GuestModal = ({ open, onOpenChange, onSubmit }: GuestModalProps) => {
  const [guestName, setGuestName] = useState("");
  const [expectedTime, setExpectedTime] = useState("");

  const handleSubmit = () => {
    if (!guestName || !expectedTime) return;

    const today = new Date();
    const [hours, minutes] = expectedTime.split(":");
    today.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    onSubmit({ guestName, expectedTime: today.toISOString() });
    setGuestName("");
    setExpectedTime("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>👤 Guest Information</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="guestName">Guest Name</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter guest name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="expectedTime">Expected Time</Label>
            <Input
              id="expectedTime"
              type="time"
              className="w-fit"
              value={expectedTime}
              onChange={(e) => setExpectedTime(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="curson-pointer">
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestModal;
