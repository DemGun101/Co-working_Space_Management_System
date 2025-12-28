import { Button } from "@/components/ui/button";
import type { User } from "@/Api/auth/types";
import { KeyRound } from "lucide-react";

interface HeaderProps {
  user: User;
  cabinNumber?: string | undefined;
  onLogout: () => void;
  onChangePassword?: () => void;
}

const Header = ({ user, onLogout, cabinNumber, onChangePassword }: HeaderProps) => {
  // Format cabin number - if it's just a number, prefix with "Cabin "
  const formatCabinNumber = (cabin: string | undefined) => {
    if (!cabin) return null;
    // If it already contains "cabin" (case insensitive), use as-is
    if (cabin.toLowerCase().includes("cabin")) return cabin;
    // Otherwise prefix with "Cabin "
    return `Cabin ${cabin}`;
  };

  const formattedCabin = formatCabinNumber(cabinNumber);

  return (
    <header className="w-full flex justify-center px-6">
      <div className="flex items-center justify-between border border-t-0 border-foreground rounded-b-full px-8 py-3 w-full max-w-md">
        <span className="flex text-sm">
          Welcome, {user.name}
          {user.role === "customer" && formattedCabin && ` (${formattedCabin})`}
        </span>

        <div className="flex items-center gap-2">
          {onChangePassword && (
            <Button
              variant="outline"
              size="icon"
              onClick={onChangePassword}
              className="rounded-full h-8 w-8 cursor-pointer"
              title="Change Password"
            >
              <KeyRound className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="flex cursor-pointer"
          >
            logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
