import { useGetActivity, type Guest } from "@/Api/user";

const Activity = () => {
  const { data: activityData } = useGetActivity();
  const guests = activityData?.guests ?? [];
  const attendance = activityData?.attendance;
  const order = activityData?.order;

  const formatTime = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasNoActivity = !attendance && !order && guests.length === 0;

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground text-center mb-4">
        Today Activity
      </h3>

      <div className="space-y-2">
        {attendance?.checkInTime && (
          <div className="flex justify-between text-sm p-2 bg-muted rounded">
            <span>Checked In</span>
            <span className="text-muted-foreground">
              {formatTime(attendance.checkInTime)}
            </span>
          </div>
        )}
        {attendance?.checkOutTime && (
          <div className="flex justify-between text-sm p-2 bg-muted rounded">
            <span>Checked Out</span>
            <span className="text-muted-foreground">
              {formatTime(attendance.checkOutTime)}
            </span>
          </div>
        )}
        {order && (
          <div className="flex justify-between text-sm p-2 bg-muted rounded">
            <span>{order.type === 'chai' ? 'Chai' : 'Coffee'} Ordered</span>
            <span className="text-muted-foreground">
              {formatTime(order.requestedAt)}
            </span>
          </div>
        )}
        {guests.map((guest: Guest) => (
          <div
            key={guest._id}
            className="flex justify-between text-sm p-2 bg-muted rounded"
          >
            <span>Guest: {guest.guestName}</span>
            <span className="text-muted-foreground">
              {formatTime(guest.expectedTime)}
            </span>
          </div>
        ))}
        {hasNoActivity && (
          <p className="text-sm text-muted-foreground text-center">
            No today activity
          </p>
        )}
      </div>
    </div>
  );
};

export default Activity;
