import { Button } from "@/components/ui/button";
import type { User } from "@/Api/auth/types";

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="flex justify-center px-6">
      <div className="flex items-center justify-between border border-t-0 border-foreground rounded-b-full px-8 py-3 gap-60 ">
        <span className="flex text-sm">
          Welcome, {user.name}
          {user.role === "customer" &&
            user.cabinNumber &&
            ` (Cabin ${user.cabinNumber})`}
        </span>
        <Button variant="outline" size="sm" onClick={onLogout} className="flex">
          logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
