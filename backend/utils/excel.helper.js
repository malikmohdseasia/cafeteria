import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export const generateExcel = async (type, range, data) => {
  const exportDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

  const filePath = path.join(exportDir, `${type}-${range}.xlsx`);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Analytics");

  sheet.mergeCells("A1:E1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = `📊 ${type.toUpperCase()} REPORT`;
  titleCell.font = { size: 18, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };

  sheet.addRow([]);
  sheet.mergeCells("A2:E2");
  const periodCell = sheet.getCell("A2");
  periodCell.value = range === "today" ? "Today Top Selling" :
                     range === "3days" ? "Last 3 Days Top Selling" :
                     range === "7days" ? "Last 7 Days Top Selling" :
                     range === "30days" ? "Last 30 Days Top Selling" : "Top Selling Items";
  periodCell.font = { size: 14, bold: true };
  periodCell.alignment = { horizontal: "center" };

  sheet.addRow([]);

  if (type === "topselling") {
    const headerRow = sheet.addRow(["Category", "Food Name", "Total Sold", "Price (₹)"]);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };
    headerRow.eachCell(cell => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCE6F1" } };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    if (Array.isArray(data) && data.length > 0) {
      data.forEach(item => {
        const row = sheet.addRow([
          item.category || "-",
          item.foodName || "-",
          item.totalSold || 0,
          item.price || 0
        ]);
        row.getCell(4).numFmt = "₹#,##0.00";
      });
    } else {
      sheet.addRow(["No data available"]);
    }

  } else if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0]);
    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };
    data.forEach(item => sheet.addRow(Object.values(item)));
  } else if (data && typeof data === "object") {
    const headerRow = sheet.addRow(["Metric", "Value"]);
    headerRow.font = { bold: true };
    Object.keys(data).forEach(key => {
      const row = sheet.addRow([key, data[key]]);
      if (typeof data[key] === "number") row.getCell(2).numFmt = "₹#,##0.00";
    });
  } else {
    sheet.addRow(["No data available"]);
  }

  sheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) maxLength = columnLength;
    });
    column.width = maxLength + 5;
  });

  sheet.views = [{ state: "frozen", ySplit: 3 }];

  await workbook.xlsx.writeFile(filePath);

  return filePath;
};