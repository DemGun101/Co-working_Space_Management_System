import {
  useGetOrders,
  useGetGuests,
  useGetCustomers,
  useCompleteOrder,
  useCompleteGuest,
} from "@/Api/office-boy";
import { useQueryClient } from "@tanstack/react-query";
import { officeBoyKeys } from "@/Api/office-boy/keys";
import RequestCard from "./request-card";

const PendingSection = () => {
  const queryClient = useQueryClient();

  const { data: orders } = useGetOrders();
  const { data: guests } = useGetGuests();
  const { data: customers } = useGetCustomers();

  const customerNameMap = new Map(
    customers?.map((c) => [c._id, c.name]) ?? []
  );

  const completeOrderMutation = useCompleteOrder();
  const completeGuestMutation = useCompleteGuest();

  const pendingOrders = orders?.filter((o) => o.status === "pending") ?? [];
  const pendingGuests = guests?.filter((g) => g.status === "pending") ?? [];

  const handleCompleteOrder = (id: string) => {
    completeOrderMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: officeBoyKeys.getOrders });
        queryClient.invalidateQueries({ queryKey: officeBoyKeys.getStats });
      },
    });
  };

  const handleCompleteGuest = (id: string) => {
    completeGuestMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: officeBoyKeys.getGuests });
        queryClient.invalidateQueries({ queryKey: officeBoyKeys.getStats });
      },
    });
  };

  const isEmpty = pendingOrders.length === 0 && pendingGuests.length === 0;

  return (
    <div className="space-y-2">
      {isEmpty && (
        <p className="text-sm text-muted-foreground">No pending requests</p>
      )}

      {pendingOrders.map((order) => (
        <RequestCard
          key={order._id}
          type="order"
          data={order}
          onComplete={handleCompleteOrder}
        />
      ))}

      {pendingGuests.map((guest) => (
        <RequestCard
          key={guest._id}
          type="guest"
          data={guest}
          customerName={customerNameMap.get(guest.customerId)}
          onComplete={handleCompleteGuest}
        />
      ))}
    </div>
  );
};

export default PendingSection;
