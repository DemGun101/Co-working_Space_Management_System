import { Button } from "@/components/ui/button";
import { CupSoda, Coffee, UserPlus, Check } from "lucide-react";
import type { Order, Guest } from "@/Api/office-boy/types";

type RequestCardProps =
  | { type: "order"; data: Order; onComplete: (id: string) => void; customerName?: string }
  | { type: "guest"; data: Guest; onComplete: (id: string) => void; customerName?: string };

const RequestCard = (props: RequestCardProps) => {
  const { type, data, onComplete, customerName } = props;

  const getIcon = () => {
    if (type === "guest") {
      return <UserPlus className="size-6" style={{ color: "#3D7EA6" }} />;
    }
    const order = data as Order;
    return order.type === "chai" ? (
      <CupSoda className="size-6" style={{ color: "#E07B39" }} />
    ) : (
      <Coffee className="size-6" style={{ color: "#8B5A2B" }} />
    );
  };

  const getTitle = () => {
    if (type === "guest") {
      const guest = data as Guest;
      const ownerInfo = customerName ? ` (${customerName})` : "";
      return `${guest.guestName} - ${guest.cabinNumber}${ownerInfo}`;
    }
    const order = data as Order;
    return `${order.type.charAt(0).toUpperCase() + order.type.slice(1)} - ${order.cabinNumber}`;
  };

  const getTime = () => {
    if (type === "guest") {
      const guest = data as Guest;
      return `Expected: ${new Date(guest.expectedTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return new Date(data.requestedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-md border">
      <div className="flex items-center gap-3">
        {getIcon()}
        <div>
          <p className="font-medium">{getTitle()}</p>
          <p className="text-sm text-muted-foreground">{getTime()}</p>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="gap-1"
        onClick={() => onComplete(data._id)}
      >
        <Check className="size-4" />
        Complete
      </Button>
    </div>
  );
};

export default RequestCard;
