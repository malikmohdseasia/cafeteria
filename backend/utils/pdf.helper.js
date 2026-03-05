import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generatePDF = async (type, range, data) => {
  const exportDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

  const filePath = path.join(exportDir, `${type}-${range}.pdf`);
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.fontSize(18).text("ANALYTICS REPORT", { align: "center" });
  doc.moveDown(0.5);

  let periodText = "";

  if (range === "today") periodText = "Today Report";
  else if (range === "3days") periodText = "Last 3 Days Report";
  else if (range === "7days") periodText = "Last 7 Days Report";
  else if (range === "30days") periodText = "Last 30 Days Report";
  else periodText = "Report";

  doc.fontSize(12).text(`Type: ${type.toUpperCase()}`, { align: "center" });
  doc.text(periodText, { align: "center" });
  doc.moveDown(1);

  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0]);

    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    const rowHeight = 25;

    const columnWidths = {
      Date: 60,
      OrderId: 160,
      EmployeeName: 100,
      EmployeeEmail: 120,
      Status: 75,
      TotalAmount: 80,
    };

    const defaultWidth = 100;

    const totalWidth = headers.reduce(
      (sum, header) => sum + (columnWidths[header] || defaultWidth),
      0
    );

    const startX = (doc.page.width - totalWidth) / 2;

    let y = doc.y;

    const drawHeader = () => {
      let x = startX;
      doc.font("Helvetica-Bold");

      headers.forEach((header) => {
        const width = columnWidths[header] || defaultWidth;

        doc.rect(x, y, width, rowHeight).stroke();
        doc.text(header, x, y + 7, {
          width,
          align: "center",
        });

        x += width;
      });

      y += rowHeight;
      doc.font("Helvetica");
    };

    drawHeader();

    data.forEach((item) => {
      if (y > doc.page.height - 60) {
        doc.addPage();
        y = 50;
        drawHeader(); 
      }

      let x = startX;

      headers.forEach((header) => {
        const width = columnWidths[header] || defaultWidth;

        doc.rect(x, y, width, rowHeight).stroke();

        const value = item[header] ?? "";

        doc.text(String(value), x, y + 7, {
          width,
          align: "center",
        });

        x += width;
      });

      y += rowHeight;
    });
  }

  else if (data && typeof data === "object") {
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    const keyWidth = pageWidth / 2;
    const valueWidth = pageWidth / 2;
    const tableWidth = keyWidth + valueWidth;

    const startX = (doc.page.width - tableWidth) / 2;
    const rowHeight = 25;

    let y = doc.y;

    doc.font("Helvetica-Bold");

    ["Metric", "Value"].forEach((header, i) => {
      doc.rect(startX + i * keyWidth, y, keyWidth, rowHeight).stroke();
      doc.text(header, startX + i * keyWidth, y + 7, {
        width: keyWidth,
        align: "center",
      });
    });

    y += rowHeight;
    doc.font("Helvetica");

    Object.keys(data).forEach((key) => {
      if (y > doc.page.height - 60) {
        doc.addPage();
        y = 50;
      }

      doc.rect(startX, y, keyWidth, rowHeight).stroke();
      doc.rect(startX + keyWidth, y, valueWidth, rowHeight).stroke();

      doc.text(String(key), startX, y + 7, {
        width: keyWidth,
        align: "center",
      });

      doc.text(String(data[key]), startX + keyWidth, y + 7, {
        width: valueWidth,
        align: "center",
      });

      y += rowHeight;
    });
  }

  else {
    doc.text("No data available", { align: "center" });
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};