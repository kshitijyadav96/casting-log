import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-excel-reader',
  template: `
    <div>
      <h1>Excel Data</h1>
      <div *ngIf="excelData && excelData.length > 0">
        <pre>{{ jsonData | json }}</pre>
      </div>
      <div *ngIf="errorMessage">
        <p style="color: red;">Error: {{ errorMessage }}</p>
      </div>
      <div *ngIf="!excelData && !errorMessage && loading">
        <p>Loading Excel data...</p>
      </div>
    </div>
  `,
})
export class ExcelReaderComponent implements OnInit {
  excelData: any[][] = [];
  jsonData: any[] = [];

  errorMessage: string = '';
  loading: boolean = false;
  excelUrl: string = './assets/Casting Replies Log.xlsx'; // Replace with the actual URL

  constructor(private excelService: ExcelService) {}

  ngOnInit(): void {
    this.loadExcelData();
  }

  loadExcelData(): void {
    this.loading = true;
    this.excelService.readExcelFromUrl(this.excelUrl).subscribe({
      next: (data) => {
        this.excelData = data;
        this.jsonData = this.convertToJson(data);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      },
    });
  }

  convertToJson(data: any[][]): any[] {
    if (data.length < 2) return [];
    const headers = data[0];
    return data.slice(1).map((row) => {
      const jsonObject: any = {};
      headers.forEach((header: string, index: number) => {
        jsonObject[header] = row[index] || null;
      });
      return jsonObject;
    });
  }
}
