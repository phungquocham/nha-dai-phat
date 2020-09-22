import { Injectable } from '@angular/core';
import { Workbook, Worksheet } from 'exceljs';

@Injectable({
  providedIn: 'root'
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

  exportExcel(excelData) {

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

  }
}
