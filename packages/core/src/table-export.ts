import type { TableColumn } from "./contracts";

function cellText<T>(row: T, column: TableColumn<T>): string {
  const value = row[column.field];
  return String(column.format ? column.format(value, row) : (value ?? ""));
}

function download(content: BlobPart, type: string, fileName: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function tableToCsv<T>(
  data: readonly T[],
  columns: readonly TableColumn<T>[],
): string {
  const escape = (value: string) => '"' + value.replaceAll('"', '""') + '"';
  return [
    columns.map((column) => column.header),
    ...data.map((item) => columns.map((column) => cellText(item, column))),
  ]
    .map((row) => row.map(escape).join(","))
    .join("\r\n");
}

export function exportTableToCsv<T>(
  data: T[],
  columns: TableColumn<T>[],
  fileName = "table",
): void {
  download(
    "\uFEFF" + tableToCsv(data, columns),
    "text/csv;charset=utf-8",
    `${fileName}.csv`,
  );
}

function xml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Downloads an Excel-compatible SpreadsheetML workbook without a runtime dependency. */
export function exportTableToExcel<T>(
  data: T[],
  columns: TableColumn<T>[],
  fileName = "table",
): void {
  const row = (values: string[]) =>
    `<Row>${values.map((value) => `<Cell><Data ss:Type="String">${xml(value)}</Data></Cell>`).join("")}</Row>`;
  const rows = [
    row(columns.map((column) => column.header)),
    ...data.map((item) => row(columns.map((column) => cellText(item, column)))),
  ].join("");
  const workbook = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Data"><Table>${rows}</Table></Worksheet></Workbook>`;
  download(workbook, "application/vnd.ms-excel", `${fileName}.xml`);
}

function pdfEscape(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replace(/[^\x20-\x7e]/g, "?");
}

/** Downloads a compact PDF containing the currently visible table data. */
export function exportTableToPdf<T>(
  data: T[],
  columns: TableColumn<T>[],
  fileName = "table",
): void {
  const wrap = (line: string) =>
    line.replace(/\r?\n/g, " ").match(/.{1,82}/gu) ?? [""];
  const header = wrap(columns.map((column) => column.header).join(" | "));
  const lines = data.flatMap((item) =>
    wrap(columns.map((column) => cellText(item, column)).join(" | ")),
  );
  const pageLength = Math.max(1, 48 - header.length);
  const pages = Array.from(
    { length: Math.max(1, Math.ceil(lines.length / pageLength)) },
    (_, index) => [
      ...header,
      ...lines.slice(index * pageLength, (index + 1) * pageLength),
    ],
  );
  const fontObject = 3 + pages.length * 2;
  const pageObjects = pages.map((_, index) => 3 + index * 2);
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageObjects.map((object) => `${object} 0 R`).join(" ")}] /Count ${pages.length} >>`,
  ];
  pages.forEach((page, index) => {
    const pageObject = 3 + index * 2;
    const contentObject = pageObject + 1;
    const commands = [
      "BT /F1 10 Tf 40 800 Td",
      ...page.flatMap((line, lineIndex) => [
        lineIndex ? "0 -15 Td" : "",
        `(${pdfEscape(line)}) Tj`,
      ]),
      "ET",
    ]
      .filter(Boolean)
      .join("\n");
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObject} 0 R >> >> /Contents ${contentObject} 0 R >>`,
      `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`,
    );
  });
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  download(pdf, "application/pdf", `${fileName}.pdf`);
}
