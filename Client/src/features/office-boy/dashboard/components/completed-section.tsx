import { useGetOrders, useGetGuests } from "@/Api/office-boy";
import { CupSoda, Coffee, UserPlus } from "lucide-react";

const CompletedSection = () => {
  const { data: orders } = useGetOrders();
  const { data: guests } = useGetGuests();

  const completedOrders = orders?.filter((o) => o.status === "completed") ?? [];
  const completedGuests = guests?.filter((g) => g.status === "completed") ?? [];

  const isEmpty = completedOrders.length === 0 && completedGuests.length === 0;

  return (
    <div className="space-y-2">
      {isEmpty && (
        <p className="text-sm text-muted-foreground">No completed items</p>
      )}
      {completedOrders.map((order) => (
        <div
          key={order._id}
          className="flex items-center gap-2 p-2 bg-background rounded-md border text-sm"
        >
          {order.type === "chai" ? (
            <CupSoda className="size-4" style={{ color: "#E07B39" }} />
          ) : (
            <Coffee className="size-4" style={{ color: "#8B5A2B" }} />
          )}
          <span>Cabin {order.cabinNumber}</span>
        </div>
      ))}

      {completedGuests.map((guest) => (
        <div
          key={guest._id}
          className="flex items-center gap-2 p-2 bg-background rounded-md border text-sm"
        >
          <UserPlus className="size-4" style={{ color: "#3D7EA6" }} />
          <span>{guest.guestName}</span>
        </div>
      ))}
    </div>
  );
};

export default CompletedSection;
