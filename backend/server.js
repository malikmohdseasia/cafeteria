import app from "./app.js";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import { startMenuCron } from "./cron/dailyMenuCron.js";


connectDB();

startMenuCron();


app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});