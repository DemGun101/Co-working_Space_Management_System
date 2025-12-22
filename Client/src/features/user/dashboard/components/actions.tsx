import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Coffee, CupSoda, UserPlus, LogIn, LogOut } from "lucide-react";

interface ActionsProps {
  isCheckedIn: boolean;
  chaiCoffeeLimitReached: boolean;
  onCheckInOut: () => void;
  onChai: () => void;
  onCoffee: () => void;
  onGuest: () => void;
  isChaiLoading?: boolean;
  isCoffeeLoading?: boolean;
  isGuestLoading?: boolean;
  isCheckInOutLoading?: boolean;
}

const Actions = ({
  isCheckedIn,
  chaiCoffeeLimitReached,
  onCheckInOut,
  onChai,
  onCoffee,
  onGuest,
  isChaiLoading = false,
  isCoffeeLoading = false,
  isGuestLoading = false,
  isCheckInOutLoading = false,
}: ActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="chai"
        size="xl"
        className={`flex-col ${chaiCoffeeLimitReached || !isCheckedIn ? "text-gray-400" : "text-[#E07B39]"}`}
        onClick={onChai}
        disabled={chaiCoffeeLimitReached || isChaiLoading || !isCheckedIn}
      >
        Chai
        {isChaiLoading ? (
          <Spinner className="size-12" />
        ) : (
          <CupSoda className={`size-12 ${chaiCoffeeLimitReached || !isCheckedIn ? "text-gray-400" : "text-[#E07B39]"}`} strokeWidth={1} />
        )}
      </Button>
      <Button
        variant="coffee"
        size="xl"
        className={`flex-col ${chaiCoffeeLimitReached || !isCheckedIn ? "text-gray-400" : "text-[#8B5A2B]"}`}
        onClick={onCoffee}
        disabled={chaiCoffeeLimitReached || isCoffeeLoading || !isCheckedIn}
      >
        Coffee
        {isCoffeeLoading ? (
          <Spinner className="size-12" />
        ) : (
          <Coffee className={`size-12 ${chaiCoffeeLimitReached || !isCheckedIn ? "text-gray-400" : "text-[#8B5A2B]"}`} strokeWidth={1} />
        )}
      </Button>
      <Button
        variant="guest"
        size="xl"
        className={`flex-col ${!isCheckedIn ? "text-gray-400" : "text-[#3D7EA6]"}`}
        onClick={onGuest}
        disabled={isGuestLoading || !isCheckedIn}
      >
        Guest
        {isGuestLoading ? (
          <Spinner className="size-12" />
        ) : (
          <UserPlus className={`size-12 ${!isCheckedIn ? "text-gray-400" : "text-[#3D7EA6]"}`} strokeWidth={1} />
        )}
      </Button>
      <Button
        variant="checkinout"
        size="xl"
        className={`flex-col ${
          isCheckedIn ? "text-red-500" : "text-[#5B8C5A]"
        }`}
        onClick={onCheckInOut}
        disabled={isCheckInOutLoading}
      >
        {isCheckedIn ? "Check Out" : "Check In"}
        {isCheckInOutLoading ? (
          <Spinner className="size-12" />
        ) : isCheckedIn ? (
          <LogOut className="size-12 text-red-500" strokeWidth={1} />
        ) : (
          <LogIn className="size-12 text-[#5B8C5A]" strokeWidth={1} />
        )}
      </Button>
    </div>
  );
};

export default Actions;
