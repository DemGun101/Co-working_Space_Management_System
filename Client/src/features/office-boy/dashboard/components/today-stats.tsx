import { useGetStats } from "@/Api/office-boy";

const TodayStats = () => {
  const { data } = useGetStats();

  return (
    <div className="flex text-sm text-muted-foreground gap-2 ">
      <div className="flex flex-col justify-center p-3 bg-muted rounded-md">
        <h2 className="font-semibold">Total Chai </h2>
        <p className="text-center">{data?.totalChai}</p>
      </div>
      <div className="flex flex-col justify-center p-3 bg-muted rounded-md">
        <h2 className="font-semibold">Total Coffee </h2>
        <p className="text-center">{data?.totalCoffee}</p>
      </div>
      <div className="flex flex-col justify-center p-3 bg-muted rounded-md">
        <h2 className="font-semibold">Guests </h2>
        <p className="text-center">{data?.guests}</p>
      </div>
      <div className="flex flex-col justify-center p-3 bg-muted rounded-md">
        <h2 className="font-semibold">Check-Ins </h2>
        <p className="text-center">{data?.checkIns}</p>
      </div>
      <div className="flex flex-col justify-center p-3 bg-muted rounded-md">
        <h2 className="font-semibold">In Office </h2>
        <p className="text-center">{data?.currentlyInOffice}</p>
      </div>
    </div>
  );
};

export default TodayStats;
