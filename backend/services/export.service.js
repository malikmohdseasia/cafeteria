import { getAnalyticsService } from "./analytics.service.js";
import { generatePDF } from "../utils/pdf.helper.js";
import { generateExcel } from "../utils/excel.helper.js";

export const exportAnalyticsService = async (type, range, format) => {

  const data = await getAnalyticsService(type, range);

  if (format === "pdf") {
    return await generatePDF(type, range, data);
  }

  if (format === "excel") {
    return await generateExcel(type, range, data);
  }

  throw new Error("Invalid export format");
};