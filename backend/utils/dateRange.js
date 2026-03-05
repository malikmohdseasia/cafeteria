export const getDateRange = (range = "7") => {
  const now = new Date();
  let startDate;

  switch (range) {
    case "today":
      startDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate()
        )
      );
      break;

    case "3":
      startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      break;

    case "7":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;

    case "1month":
      startDate = new Date(now);
      startDate.setUTCMonth(startDate.getUTCMonth() - 1);
      break;

    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return { startDate, endDate: now };
};