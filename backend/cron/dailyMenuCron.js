import cron from "node-cron";
import { resetMenuItemsDaily } from "../services/daily.menu.service.js";
export const startMenuCron = () => {
 cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      console.log("⏰ Clearing menu items at midnight");
      await resetMenuItemsDaily();
      console.log("✅ Menu items cleared");
    } catch (error) {
      console.error("❌ Failed to clear menu items", error.message);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);
};