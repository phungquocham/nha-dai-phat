import { Injectable } from '@angular/core';
import { CellValue, Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';

interface HeaderCell {
  worksheet: Worksheet;
  value: any;

  mergeCells?: string;
  font?: object;
  alignment?: object;
  border?: object;
  width?: number;
  height?: number;
  cellName?: string;
}

interface ChildHeaderCell {
  cellName: string;
  values: any[];
  xColumns: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ExportReportExcelService {
  private xColumns = [];
  private alphaStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor() {
    this.xColumns = this.alphaStr.split('');
  }

  private createHeaderCell(headerCell: HeaderCell) {
    let cellName = '';
    if (headerCell.mergeCells) {
      const cells = headerCell.mergeCells.split(':');
      if (cells.length > 1) {
        headerCell.worksheet.mergeCells(headerCell.mergeCells);
      }
      cellName = cells[0];
    } else if (headerCell.cellName) {
      cellName = headerCell.cellName;
    }

    const cell = headerCell.worksheet.getCell(cellName);
    cell.value = headerCell.value;

    cell.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
    };

    if (headerCell.font) {
      cell.font = { ...cell.font, ...headerCell.font };
    }

    cell.alignment = { vertical: 'middle', horizontal: 'center' };

    cell.border = {
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    if (headerCell.width) {
      const key = cellName.split('')[0];
      headerCell.worksheet.getColumn(key).width = headerCell.width;
    }
  }

  private getChildHeaderCells(childHeaderCell: ChildHeaderCell) {
    const [xCellName, yCellName] = childHeaderCell.cellName.split('');

    const index = childHeaderCell.xColumns.indexOf(xCellName);

    if (index > -1) {
      return childHeaderCell.xColumns
        .slice(index, index + childHeaderCell.values.length)
        .map((character) => character + yCellName);
    }
    return [];
  }

  exportExcel(excelData) {
    // Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;

    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sales Data');

    // Freeze Header & first column
    worksheet.views = [
      {
        state: 'frozen',
        xSplit: 1,
        ySplit: 2,
        activeCell: 'A1',
      },
    ];

    this.createHeaderCell({
      worksheet,
      mergeCells: 'A1:A2',
      value: 'TÊN',
      width: 25,
    });

    this.createHeaderCell({
      worksheet,
      mergeCells: 'B1:B2',
      value: 'GIỜ VÀNG',
      width: 15,
    });

    this.createHeaderCell({
      worksheet,
      mergeCells: 'C1:I1',
      value: 'ĐỔ ĐỀU ĐẶN',
    });
    const pourColumns = ['KLL', 'KBM', 'KNC', 'CM', '2 câu', '> 2 câu', 'Tổng'];
    const pourCells = this.getChildHeaderCells({
      cellName: 'C2',
      values: pourColumns,
      xColumns: this.xColumns,
    });
    pourColumns.forEach((value, index) => {
      this.createHeaderCell({
        worksheet,
        cellName: pourCells[index],
        value,
        font: {
          bold: false,
        },
        width: 10,
      });
    });

    this.createHeaderCell({
      worksheet,
      mergeCells: 'J1:P1',
      value: 'TỰ ĐỔ',
    });
    const pushColumns = [...pourColumns];
    const pushCells = this.getChildHeaderCells({
      cellName: 'J2',
      values: pushColumns,
      xColumns: this.xColumns,
    });
    pushColumns.forEach((value, index) => {
      this.createHeaderCell({
        worksheet,
        cellName: pushCells[index],
        value,
        font: {
          bold: false,
        },
        width: 10,
      });
    });

    this.createHeaderCell({
      worksheet,
      mergeCells: 'Q1:Q2',
      value: 'ĐẨY',
      width: 10,
    });
    this.createHeaderCell({
      worksheet,
      mergeCells: 'R1:R2',
      value: 'GỢI MỞ',
      width: 10,
    });
    this.createHeaderCell({
      worksheet,
      mergeCells: 'S1:S2',
      value: 'EMAIL',
      width: 10,
    });
    this.createHeaderCell({
      worksheet,
      mergeCells: 'T1:T2',
      value: 'THÍNH',
      width: 10,
    });

    // Add Row and formatting
    // worksheet.mergeCells('C1:F4');
    // const titleRow = worksheet.getCell('C1');
    // titleRow.value = title;
    // titleRow.font = {
    //   name: 'Calibri',
    //   size: 16,
    //   underline: 'single',
    //   bold: true,
    //   color: { argb: '0085A3' },
    // };
    // titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Date
    // worksheet.mergeCells('G1:H4');
    // const d = new Date();
    // const date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    // const dateCell = worksheet.getCell('G1');
    // dateCell.value = date;
    // dateCell.font = {
    //   name: 'Calibri',
    //   size: 12,
    //   bold: true,
    // };
    // dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add Image
    // const myLogoImage = workbook.addImage({
    //   base64: logo.imgBase64,
    //   extension: 'png',
    // });
    // worksheet.mergeCells('A1:B4');
    // worksheet.addImage(myLogoImage, 'A1:B4');

    // Blank Row
    // worksheet.addRow([]);

    // Adding Header Row
    // const headerRow = worksheet.addRow(header);
    // // headerRow.eachCell((cell, number) => {
    // headerRow.eachCell((cell) => {
    //   cell.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: '4167B8' },
    //     bgColor: { argb: '' },
    //   };
    //   cell.font = {
    //     bold: false,
    //     color: { argb: 'FFFFFF' },
    //     size: 12,
    //   };
    // });

    // Adding Data with Conditional Formatting
    data.forEach((item) => {
      const row = worksheet.addRow(item);

      row.alignment = { vertical: 'middle', horizontal: 'center' };

      const nameColumn = row.getCell(1);
      nameColumn.alignment = { vertical: 'middle', horizontal: 'left' };

      const sales = row.getCell(6);
      let color = 'FF99FF99';
      if (+sales.value < 200000) {
        color = 'FF9999';
      }
      sales.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      };
      // tooltip for cell:  sales.comment not working, but sales.note is
      sales.note = {
        texts: [
          {
            text: 'aaaaaaaaaaaa',
          },
        ],
      };
    });

    // worksheet.getColumn(3).width = 20;
    // worksheet.addRow([]);

    // Footer Row
    // const footerRow = worksheet.addRow([
    //   'Employee Sales Report Generated from example.com at ' + date,
    // ]);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFB050' },
    // };

    // Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((resp) => {
      const blob = new Blob([resp], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }
}

// exportExcel(excelData) {
//   // Title, Header & Data
//   const title = excelData.title;
//   const header = excelData.headers;
//   const data = excelData.data;

//   // Create a workbook with a worksheet
//   const workbook = new Workbook();
//   const worksheet = workbook.addWorksheet('Sales Data');

//   // Add Row and formatting
//   // worksheet.mergeCells('C1:F4');
//   // const titleRow = worksheet.getCell('C1');
//   // titleRow.value = title;
//   // titleRow.font = {
//   //   name: 'Calibri',
//   //   size: 16,
//   //   underline: 'single',
//   //   bold: true,
//   //   color: { argb: '0085A3' },
//   // };
//   // titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

//   // Date
//   // worksheet.mergeCells('G1:H4');
//   // const d = new Date();
//   // const date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
//   // const dateCell = worksheet.getCell('G1');
//   // dateCell.value = date;
//   // dateCell.font = {
//   //   name: 'Calibri',
//   //   size: 12,
//   //   bold: true,
//   // };
//   // dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

//   // Add Image
//   // const myLogoImage = workbook.addImage({
//   //   base64: logo.imgBase64,
//   //   extension: 'png',
//   // });
//   // worksheet.mergeCells('A1:B4');
//   // worksheet.addImage(myLogoImage, 'A1:B4');

//   // Blank Row
//   // worksheet.addRow([]);

//   // Adding Header Row
//   const headerRow = worksheet.addRow(header);
//   // headerRow.eachCell((cell, number) => {
//   headerRow.eachCell((cell) => {
//     cell.fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: '4167B8' },
//       bgColor: { argb: '' },
//     };
//     cell.font = {
//       bold: false,
//       color: { argb: 'FFFFFF' },
//       size: 12,
//     };
//   });

//   // Adding Data with Conditional Formatting
//   data.forEach((item) => {
//     const row = worksheet.addRow(item);

//     const sales = row.getCell(6);
//     let color = 'FF99FF99';
//     if (+sales.value < 200000) {
//       color = 'FF9999';
//     }

//     sales.fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: color },
//     };
//   });

//   worksheet.getColumn(3).width = 20;
//   worksheet.addRow([]);

//   // Footer Row
//   // const footerRow = worksheet.addRow([
//   //   'Employee Sales Report Generated from example.com at ' + date,
//   // ]);
//   // footerRow.getCell(1).fill = {
//   //   type: 'pattern',
//   //   pattern: 'solid',
//   //   fgColor: { argb: 'FFB050' },
//   // };

//   // Merge Cells
//   // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

//   // Generate & Save Excel File
//   workbook.xlsx.writeBuffer().then((resp) => {
//     const blob = new Blob([resp], {
//       type:
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     });
//     fs.saveAs(blob, title + '.xlsx');
//   });
// }
