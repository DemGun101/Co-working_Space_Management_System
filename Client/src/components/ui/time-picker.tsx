import * as React from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimePickerProps {
  value?: string; // Format: "HH:mm"
  onChange?: (time: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minuteStep?: number;
}

export function TimePicker({
  value = "",
  onChange,
  placeholder = "Select time",
  className,
  disabled = false,
  minuteStep = 5,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse value into hours and minutes
  const [hours, minutes] = React.useMemo(() => {
    if (!value) return [9, 0]; // Default to 9:00 AM
    const [h, m] = value.split(":").map(Number);
    return [h || 0, m || 0];
  }, [value]);

  const formatTime = (h: number, m: number): string => {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const formatDisplayTime = (timeStr: string): string => {
    if (!timeStr) return placeholder;
    const [h, m] = timeStr.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;
    return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const handleHourChange = (delta: number) => {
    let newHour = hours + delta;
    if (newHour < 0) newHour = 23;
    if (newHour > 23) newHour = 0;
    onChange?.(formatTime(newHour, minutes));
  };

  const handleMinuteChange = (delta: number) => {
    let newMinute = minutes + delta * minuteStep;
    if (newMinute < 0) newMinute = 60 - minuteStep;
    if (newMinute >= 60) newMinute = 0;
    onChange?.(formatTime(hours, newMinute));
  };

  const handleQuickSelect = (h: number, m: number) => {
    onChange?.(formatTime(h, m));
    setOpen(false);
  };

  // Quick time presets
  const presets = [
    { label: "9:00 AM", hours: 9, minutes: 0 },
    { label: "10:00 AM", hours: 10, minutes: 0 },
    { label: "11:00 AM", hours: 11, minutes: 0 },
    { label: "12:00 PM", hours: 12, minutes: 0 },
    { label: "1:00 PM", hours: 13, minutes: 0 },
    { label: "2:00 PM", hours: 14, minutes: 0 },
    { label: "3:00 PM", hours: 15, minutes: 0 },
    { label: "4:00 PM", hours: 16, minutes: 0 },
    { label: "5:00 PM", hours: 17, minutes: 0 },
    { label: "6:00 PM", hours: 18, minutes: 0 },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplayTime(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex flex-col gap-4">
          {/* Time spinner */}
          <div className="flex items-center justify-center gap-4">
            {/* Hours */}
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleHourChange(1)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <div className="w-12 text-center text-2xl font-semibold tabular-nums">
                {hours.toString().padStart(2, "0")}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleHourChange(-1)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <span className="text-2xl font-semibold">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleMinuteChange(1)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <div className="w-12 text-center text-2xl font-semibold tabular-nums">
                {minutes.toString().padStart(2, "0")}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleMinuteChange(-1)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* AM/PM indicator */}
            <div className="ml-2 text-lg font-medium text-muted-foreground">
              {hours >= 12 ? "PM" : "AM"}
            </div>
          </div>

          {/* Quick presets */}
          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground mb-2">Quick select</p>
            <div className="grid grid-cols-5 gap-1">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant={
                    hours === preset.hours && minutes === preset.minutes
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className="text-xs px-2"
                  onClick={() => handleQuickSelect(preset.hours, preset.minutes)}
                >
                  {preset.label.replace(":00 ", "")}
                </Button>
              ))}
            </div>
          </div>

          {/* Confirm button */}
          <Button
            className="w-full"
            onClick={() => {
              if (!value) {
                onChange?.(formatTime(hours, minutes));
              }
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
