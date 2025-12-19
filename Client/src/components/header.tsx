import { Button } from "@/components/ui/button";
import type { User } from "@/Api/auth/types";

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="w-full flex justify-center px-6">
      <div className="flex items-center justify-between border border-t-0 border-foreground rounded-b-full px-8 py-3 w-full max-w-md">
        <span className="flex text-sm">
          Welcome, {user.name}
          {user.role === "customer" &&
            user.cabinNumber &&
            ` (Cabin ${user.cabinNumber})`}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="flex cursor-pointer"
        >
          logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
