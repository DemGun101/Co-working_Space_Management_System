interface ActivityProps {
  lastCheckIn?: string;
  lastCheckOut?: string;
  todayChaiCoffeeUsed: number;
}

const Activity = ({ lastCheckIn, lastCheckOut, todayChaiCoffeeUsed }: ActivityProps) => {
  const formatTime = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Recent Activity</h3>
      <div className="space-y-2">
        {lastCheckIn && (
          <div className="flex justify-between text-sm p-2 bg-muted rounded">
            <span>Checked In</span>
            <span className="text-muted-foreground">
              {formatDate(lastCheckIn)} at {formatTime(lastCheckIn)}
            </span>
          </div>
        )}
        {lastCheckOut && (
          <div className="flex justify-between text-sm p-2 bg-muted rounded">
            <span>Checked Out</span>
            <span className="text-muted-foreground">
              {formatDate(lastCheckOut)} at {formatTime(lastCheckOut)}
            </span>
          </div>
        )}
        {todayChaiCoffeeUsed > 0 && (
          <div className="flex justify-between text-sm p-2 bg-muted rounded">
            <span>Chai/Coffee Ordered</span>
            <span className="text-muted-foreground">Today</span>
          </div>
        )}
        {!lastCheckIn && !lastCheckOut && todayChaiCoffeeUsed === 0 && (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default Activity;
