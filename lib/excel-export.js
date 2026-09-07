import * as XLSX from 'xlsx';

/**
 * Cleanly formats a cell value for Excel
 */
function cleanValue(val) {
  if (val === null || val === undefined) return '';
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (typeof val === 'object') return JSON.stringify(val);
  return val;
}

/**
 * Auto-calculates column widths based on cell contents
 */
function calculateColumnWidths(data) {
  if (!data || data.length === 0) return [];
  const keys = Object.keys(data[0]);
  return keys.map((key) => {
    let maxLen = String(key).length;
    for (const row of data) {
      const valStr = String(row[key] ?? '');
      if (valStr.length > maxLen) {
        maxLen = Math.min(valStr.length, 50); // cap max width at 50
      }
    }
    return { wch: Math.max(maxLen + 3, 10) };
  });
}

/**
 * Exports a single dataset to an Excel (.xlsx) file and triggers download
 * @param {Array<Object>} data Array of flat objects
 * @param {string} fileName Name of file (e.g. 'orders_report')
 * @param {string} sheetName Name of sheet tab
 */
export function exportToExcel(data, fileName = 'export', sheetName = 'Sheet1') {
  if (!data || data.length === 0) {
    alert('No records available to export.');
    return;
  }

  const cleanedData = data.map((row) => {
    const cleanRow = {};
    for (const [k, v] of Object.entries(row)) {
      cleanRow[k] = cleanValue(v);
    }
    return cleanRow;
  });

  const ws = XLSX.utils.json_to_sheet(cleanedData);
  ws['!cols'] = calculateColumnWidths(cleanedData);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));

  const timestamp = new Date().toISOString().split('T')[0];
  const finalFileName = `${fileName}_${timestamp}.xlsx`;

  XLSX.writeFile(wb, finalFileName);
}

/**
 * Exports multiple datasets into separate tabs of a single Excel (.xlsx) workbook
 * @param {Array<{sheetName: string, data: Array<Object>}>} sheets Array of sheet configurations
 * @param {string} fileName Name of workbook file
 */
export function exportMultiSheetExcel(sheets, fileName = 'lovelycrafts_master_report') {
  const wb = XLSX.utils.book_new();
  let hasData = false;

  for (const { sheetName, data } of sheets) {
    if (data && data.length > 0) {
      hasData = true;
      const cleanedData = data.map((row) => {
        const cleanRow = {};
        for (const [k, v] of Object.entries(row)) {
          cleanRow[k] = cleanValue(v);
        }
        return cleanRow;
      });

      const ws = XLSX.utils.json_to_sheet(cleanedData);
      ws['!cols'] = calculateColumnWidths(cleanedData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
    }
  }

  if (!hasData) {
    alert('No data available to export in any sheet.');
    return;
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const finalFileName = `${fileName}_${timestamp}.xlsx`;

  XLSX.writeFile(wb, finalFileName);
}
