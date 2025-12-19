import { useGetActivity, type Guest } from "@/Api/user";

interface ActivityProps {
  lastCheckIn?: string;
  lastCheckOut?: string;
  todayChaiCoffeeUsed: number;
}

const Activity = ({ lastCheckIn, lastCheckOut, todayChaiCoffeeUsed }: ActivityProps) => {
  const { data: activityData } = useGetActivity();
  const guests = activityData?.guests ?? [];

  const formatTime = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  

  const hasNoActivity = !lastCheckIn && !lastCheckOut && todayChaiCoffeeUsed === 0 && guests.length === 0;

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground text-center mb-4">Recent Activity</h3>

      <div className="space-y-2">
        {lastCheckIn && (
          <div className="flex justify-between text-sm p-2 bg-muted rounded">
            <span>Checked In</span>
            <span className="text-muted-foreground">
               {formatTime(lastCheckIn)}
            </span>
          </div>
        )}
        {lastCheckOut && (
          <div className="flex justify-between text-sm p-2 bg-muted rounded">
            <span>Checked Out</span>
            <span className="text-muted-foreground">
              {formatTime(lastCheckOut)}
            </span>
          </div>
        )}
        {todayChaiCoffeeUsed > 0 && (
          <div className="flex justify-between text-sm p-2 bg-muted rounded">
            <span>Chai/Coffee Ordered</span>
            <span className="text-muted-foreground">Today</span>
          </div>
        )}
        {guests.map((guest: Guest) => (
          <div key={guest._id} className="flex justify-between text-sm p-2 bg-muted rounded">
            <span>Guest: {guest.guestName}</span>
            <span className="text-muted-foreground">
              {formatTime(guest.expectedTime)}
            </span>
          </div>
        ))}
        {hasNoActivity && (
          <p className="text-sm text-muted-foreground text-center">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default Activity;
