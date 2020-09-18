import { Injectable } from '@angular/core';
import { CellValue, Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { Rgba } from 'ngx-color-picker';

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
  fill?: object;
}

interface ChildHeaderCell {
  cellName: string;
  values: any[];
  xColumns: any[];
}

interface IXNextKeyData {
  initKeys: string[];
  currentKey: string;
  keysCount: number;
  yKey?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ExportReportExcelService {
  private xColumns = [];
  private alphaStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private xColumnsAutoInit = [];

  constructor() {
    this.xColumns = this.alphaStr.split('');
    this.xColumnsAutoInit = [...this.xColumns];
    for (let i = 0; i < 20; i++) {
      this.xColumnsAutoInit = this.xColumnsAutoInit.concat(
        this.xColumns.map((item) => this.xColumns[i] + item)
      );
    }
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
    if (headerCell.border) {
      cell.border = { ...cell.border, ...headerCell.border };
    }

    if (headerCell.width) {
      const key = cellName.split('')[0];
      headerCell.worksheet.getColumn(key).width = headerCell.width;
    }

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '' },
    };
    if (headerCell.fill) {
      cell.fill = { ...cell.fill, ...headerCell.fill };
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

  private removeHashTag(colorHex: string) {
    return colorHex.replace('#', '');
  }

  private createBasicHeaderCell(worksheet: Worksheet) {
    this.createHeaderCell({
      worksheet,
      mergeCells: 'A1:A2',
      value: 'TÊN',
      width: 22,
    });

    this.createHeaderCell({
      worksheet,
      mergeCells: 'B1:B2',
      value: 'GIỜ VÀNG',
      width: 12,
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
        width: 8,
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
        width: 8,
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
  }

  private createSourcesHeaderCell(
    worksheet: Worksheet,
    sourceHeaders: any[],
    currentXCell: string
  ) {
    if (sourceHeaders.length > 0) {
      let sourceCurrentColumn = currentXCell;
      sourceHeaders.forEach((source) => {
        let childCellLen = 0;
        if (source.id === 0) {
          childCellLen = 19;
        } else {
          childCellLen = 18;
        }

        const beginIndex = this.xColumnsAutoInit.indexOf(sourceCurrentColumn);
        const endIndex = beginIndex + childCellLen - 1;

        this.createHeaderCell({
          worksheet,
          mergeCells: `${this.xColumnsAutoInit[beginIndex]}1:${this.xColumnsAutoInit[endIndex]}2`,
          value: source.name,
          border: {
            bottom: {
              style: 'double',
              color: { argb: this.removeHashTag(source.color) },
            },
          },
        });

        sourceCurrentColumn = this.xColumnsAutoInit[endIndex + 1];
      });
    }
  }

  private addDataCells(worksheet: Worksheet, data: any[], sourcesData: any[]) {
    const sourceValues: any[] = sourcesData.map((source: any[]) => {
      return source.map((item) => item.value);
    });
    const combinedData = [];
    data.forEach((item, index) => {
      // basic data + source data
      combinedData.push(item.concat(sourceValues[index]));
    });

    // Adding Data with Conditional Formatting
    combinedData.forEach((item, dataIndex) => {
      const row = worksheet.addRow(item);

      row.alignment = { vertical: 'middle', horizontal: 'center' };

      row.border = {
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      const nameColumn = row.getCell('A');
      nameColumn.alignment = { vertical: 'middle', horizontal: 'left' };

      let sourceCell = 'U';
      let sourceCellIndex = this.xColumnsAutoInit.indexOf(sourceCell);

      sourcesData[dataIndex].forEach((src) => {
        const cell = row.getCell(sourceCell);
        cell.font = {
          color: { argb: 'ffffff' },
          bold: true,
        };

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.removeHashTag(src.color) },
        };

        if (src.tooltip && src.tooltip.length > 0) {
          cell.note = {
            texts: [
              {
                font: {
                  size: 12,
                  name: 'Calibri',
                  family: 2,
                },
                text: src.tooltip,
              },
            ],
            margins: {
              insetmode: 'custom',
              inset: [0.25, 0.25, 0.35, 0.35],
            },
            protection: {
              locked: 'True',
              lockText: 'False',
            },
            editAs: 'twoCells',
          };
        }

        sourceCellIndex += 1;
        sourceCell = this.xColumnsAutoInit[sourceCellIndex];
      });
    });
  }

  exportExcel(excelData) {
    // Title, Header & Data
    const title: string = excelData.title;
    const data: any[] = excelData.data;
    const sourceHeaders: any[] = excelData.sourceHeaders;
    const sourceExcelRows: [] = excelData.sourceExcelRows;

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

    this.createBasicHeaderCell(worksheet);

    this.createSourcesHeaderCell(worksheet, sourceHeaders, 'U');

    this.addDataCells(worksheet, data, sourceExcelRows);

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
