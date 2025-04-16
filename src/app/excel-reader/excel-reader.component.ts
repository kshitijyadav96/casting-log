import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-excel-reader',
  templateUrl: './excel-reader.component.html',
  styleUrls: ['./excel-reader.component.scss'],
})
export class ExcelReaderComponent implements OnInit {
  excelData: any[][] = [];
  jsonData: {
    No: string;
    Name: string;
    Gender: 'Male' | 'Female';
    Phone: string;
    Age: string;
    Portfolio: { value: string; hyperlink: string } | null;
    Height: string | null;
    Weight: string | null;
    Complexion: string | null;
    Address: string | null;
    Instagram: string | null;
    Image: string | null;
  }[] = [];

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
