import cron from 'node-cron';
import { Order, GuestRequest, User } from '../models';

cron.schedule('00 00 * * *', async () => {
  try {
    console.log('Running daily reset...');

    await Order.deleteMany({});
    await GuestRequest.deleteMany({});
    await User.updateMany({}, { todayChaiCoffeeUsed: 0 });

  } catch (error) {
  }
});

