import { Button } from "@/components/ui/button";
import { Coffee, CupSoda, UserPlus, LogIn, LogOut } from "lucide-react";

interface ActionsProps {
  isCheckedIn: boolean;
  chaiCoffeeLimitReached: boolean;
  onCheckInOut: () => void;
  onChai: () => void;
  onCoffee: () => void;
  onGuest: () => void;
}

const Actions = ({
  isCheckedIn,
  chaiCoffeeLimitReached,
  onCheckInOut,
  onChai,
  onCoffee,
  onGuest,
}: ActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="chai"
        size="xl"
        className={`flex-col ${chaiCoffeeLimitReached ? "text-gray-400" : "text-[#E07B39]"}`}
        onClick={onChai}
        disabled={chaiCoffeeLimitReached}
      >
        Chai
        <CupSoda className={`size-12 ${chaiCoffeeLimitReached ? "text-gray-400" : "text-[#E07B39]"}`} strokeWidth={1} />
      </Button>
      <Button
        variant="coffee"
        size="xl"
        className={`flex-col ${chaiCoffeeLimitReached ? "text-gray-400" : "text-[#8B5A2B]"}`}
        onClick={onCoffee}
        disabled={chaiCoffeeLimitReached}
      >
        Coffee
        <Coffee className={`size-12 ${chaiCoffeeLimitReached ? "text-gray-400" : "text-[#8B5A2B]"}`} strokeWidth={1} />
      </Button>
      <Button
        variant="guest"
        size="xl"
        className="flex-col text-[#3D7EA6]"
        onClick={onGuest}
      >
        Guest
        <UserPlus className="size-12 text-[#3D7EA6]" strokeWidth={1} />
      </Button>
      <Button
        variant="checkinout"
        size="xl"
        className={`flex-col ${
          isCheckedIn ? "text-red-500" : "text-[#5B8C5A]"
        }`}
        onClick={onCheckInOut}
      >
        {isCheckedIn ? "Check Out" : "Check In"}
        {isCheckedIn ? (
          <LogOut className="size-12 text-red-500" strokeWidth={1} />
        ) : (
          <LogIn className="size-12 text-[#5B8C5A]" strokeWidth={1} />
        )}
      </Button>
    </div>
  );
};

export default Actions;
