import cron from "node-cron";
import { Order, GuestRequest, User, AttendanceLog } from "../models";

cron.schedule("00 00 * * *", async () => {
  try {
    console.log("Running daily reset...");

    await Order.deleteMany({});
    await GuestRequest.deleteMany({});
    await User.updateMany({}, { todayChaiCoffeeUsed: 0, isCheckedIn: false });
    await AttendanceLog.deleteMany({});
  } catch (error) {}
});
