import { useState } from "react";
import { useGetAdminActivity, useGetFilterOptions } from "@/Api/admin";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HistoryTable = () => {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedCabin, setSelectedCabin] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const { data: filterOptions } = useGetFilterOptions();

  // Format dates for API (YYYY-MM-DD)
  const formatDateForApi = (date: Date | undefined): string | undefined => {
    if (!date) return undefined;
    return date.toISOString().split("T")[0];
  };

  const { data, isLoading } = useGetAdminActivity({
    page,
    limit: 10,
    startDate: formatDateForApi(startDate),
    endDate: formatDateForApi(endDate),
    cabinNumber: selectedCabin || undefined,
    customerId: selectedCustomer || undefined,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 flex-wrap items-end">
        <div className="flex items-center gap-2">
          <span className="text-sm">From:</span>
          <DatePicker
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
              setPage(1);
            }}
            placeholder="Start date"
            className="w-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">To:</span>
          <DatePicker
            value={endDate}
            onChange={(date) => {
              setEndDate(date);
              setPage(1);
            }}
            placeholder="End date"
            className="w-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Cabin:</span>
          <Select
            value={selectedCabin}
            onValueChange={(value) => {
              setSelectedCabin(value === "all" ? "" : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {filterOptions?.cabins.map((cabin) => (
                <SelectItem key={cabin} value={cabin}>
                  {cabin}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Customer:</span>
          <Select
            value={selectedCustomer}
            onValueChange={(value) => {
              setSelectedCustomer(value === "all" ? "" : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {filterOptions?.customers.map((customer) => (
                <SelectItem key={customer._id} value={customer._id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(startDate || endDate || selectedCabin || selectedCustomer) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
              setSelectedCabin("");
              setSelectedCustomer("");
              setPage(1);
            }}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">Date</th>
              <th className="text-left py-2 px-2">Customer</th>
              <th className="text-left py-2 px-2">Cabin</th>
              <th className="text-left py-2 px-2">Check In</th>
              <th className="text-left py-2 px-2">Check Out</th>
              <th className="text-left py-2 px-2">Hours</th>
              <th className="text-left py-2 px-2">Order</th>
              <th className="text-left py-2 px-2">Guests</th>
            </tr>
          </thead>
          <tbody>
            {data?.activities && data.activities.length > 0 ? (
              data.activities.map((activity) => (
                <tr key={activity._id} className="border-b hover:bg-background/50">
                  <td className="py-2 px-2">{formatDate(activity.date)}</td>
                  <td className="py-2 px-2">
                    {activity.customerId?.name || "Unknown"}
                  </td>
                  <td className="py-2 px-2">{activity.cabinNumber || "-"}</td>
                  <td className="py-2 px-2">
                    {formatTime(activity.attendance?.checkInTime)}
                  </td>
                  <td className="py-2 px-2">
                    {formatTime(activity.attendance?.checkOutTime)}
                  </td>
                  <td className="py-2 px-2">
                    {activity.attendance?.totalHours
                      ? `${activity.attendance.totalHours.toFixed(1)}h`
                      : "-"}
                  </td>
                  <td className="py-2 px-2">
                    {activity.order?.type ? (
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          activity.order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {activity.order.type}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {activity.guests?.length > 0 ? activity.guests.length : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground">
                  No history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <span className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.pages} ({data.pagination.total} records)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
