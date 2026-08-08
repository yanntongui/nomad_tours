export function parseCsv(text: string): Record<string, string>[] {
  const rows = parseCsvRows(text.replace(/\r\n/g, "\n").replace(/\r/g, "\n"));
  if (rows.length === 0) return [];
  const [header, ...body] = rows;
  return body
    .filter((row) => row.some((cell) => cell.trim().length > 0))
    .map((row) => Object.fromEntries(header.map((key, i) => [key.trim(), (row[i] ?? "").trim()])));
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}
