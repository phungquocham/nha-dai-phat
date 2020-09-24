import { Injectable } from '@angular/core';
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';

interface RatingItem {
  name: string;
  value: number;
  color: string;
  tooltip: string;
}

interface HandledRatingItem {
  value: string;
  color: string;
  tooltip: string;
}
interface TelesaleReportItem {
  ratingItems: any;
  ratings: {
    ratingOthers: RatingItem[];
    ratingPourings: RatingItem[];
    ratingPushings: RatingItem[];
  };
  teleUserId: number;
  teleUserName: string;
  teleUserNameTooltip: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExportTelesalesReportService {
  private alphaStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private xColumns = [];

  constructor() {
    const alphaColumns = this.alphaStr.split('');
    this.xColumns = [...alphaColumns];
    for (let i = 0; i < 3; i++) {
      this.xColumns = this.xColumns.concat(
        alphaColumns.map((item) => alphaColumns[i] + item)
      );
    }
  }

  handleRatingItem(item: RatingItem) {
    return {
      value: `${item.name}: ${item.value}`,
      color: item.color,
      tooltip: item.tooltip,
    };
  }

  handleReportItem(report: TelesaleReportItem): any[] {
    let result = [];

    if (!report.teleUserNameTooltip) {
      result.push({
        value: '',
        color: '',
        tooltip: '',
      });
    } else {
      const words = report.teleUserNameTooltip.split(' ');
      words.push(words.shift());
      result.push({
        value: words.join(' '),
        color: '',
        tooltip: '',
      });
    }

    result = [
      ...result,
      ...report.ratings.ratingPourings.map((item) =>
        this.handleRatingItem(item)
      ),
      ...report.ratings.ratingPushings.map((item) =>
        this.handleRatingItem(item)
      ),
      ...report.ratings.ratingOthers.map((item) => this.handleRatingItem(item)),
    ];

    return result;
  }

  private removeHashTag(colorHex: string) {
    return colorHex.replace('#', '');
  }

  exportExcel(excelData) {
    const title: string = excelData.title;
    const data: TelesaleReportItem[] = excelData.data;
    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Telesales Data');

    // Freeze Header & first column
    worksheet.views = [
      {
        state: 'frozen',
        xSplit: 1,
        ySplit: 0,
        activeCell: 'A1',
      },
    ];

    const handledData = data.map((item) => this.handleReportItem(item));
    console.log('******', { data, handledData });

    const firstItem: TelesaleReportItem = data[0];
    let columnsLength = 0;
    const pourLength =
      firstItem && firstItem.ratings && firstItem.ratings.ratingPourings
        ? firstItem.ratings.ratingPourings.length
        : 0;
    const pushLength =
      firstItem && firstItem.ratings && firstItem.ratings.ratingPushings
        ? firstItem.ratings.ratingPushings.length
        : 0;
    const otherLength =
      firstItem && firstItem.ratings && firstItem.ratings.ratingOthers
        ? firstItem.ratings.ratingOthers.length
        : 0;
    if (firstItem) {
      columnsLength = 1 + pourLength + pushLength + otherLength; // name + rating columns
    }

    const redBorerPositions = [pourLength, pourLength + pushLength];

    const nameColumn = worksheet.getColumn('A');
    nameColumn.width = 22;
    nameColumn.alignment = { vertical: 'middle', horizontal: 'left' };

    const firstHandledItem = handledData[0];
    if (firstHandledItem) {
      firstHandledItem.forEach((item, index) => {
        if (index === 0) {
          return;
        }

        const column = worksheet.getColumn(`${this.xColumns[index]}`);
        column.width = 12;
        column.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    }

    handledData.forEach((item: HandledRatingItem[], rowIndex) => {
      const row = worksheet.addRow(item.map((i) => i.value));

      row.font = {
        size: 12,
      };

      item.forEach((itemData: HandledRatingItem, cellIndex) => {
        const cell = worksheet.getCell(
          `${this.xColumns[cellIndex]}${rowIndex + 1}`
        );

        if (redBorerPositions.includes(cellIndex)) {
          cell.border = {
            bottom: { style: 'thin' },
            right: { style: 'thick', color: { argb: 'FF0000' } },
          };
        } else {
          cell.border = {
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }

        if (cellIndex === 0) {
          return;
        }

        cell.font = {
          color: { argb: 'ffffff' },
          size: 12,
        };

        if (itemData.color) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: this.removeHashTag(itemData.color) },
          };
        }

        if (itemData.tooltip) {
          cell.note = {
            texts: [
              {
                font: {
                  size: 12,
                  name: 'Calibri',
                  family: 2,
                },
                text: itemData.tooltip,
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
      });
    });

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
