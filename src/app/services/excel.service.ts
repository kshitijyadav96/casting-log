import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import * as XLSX from 'xlsx';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor(private http: HttpClient) {}

  readExcelFromUrl(url: string): Observable<any[][]> {
    return this.http.get(url, { responseType: 'arraybuffer' }).pipe(
      catchError(this.handleError),
      map((response: ArrayBuffer) => {
        const workbook = XLSX.read(new Uint8Array(response), { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // header: 1 gets array of arrays

        // Extract hyperlinks
        const hyperlinks: { [key: string]: string } = {};
        Object.keys(worksheet).forEach((cell) => {
          if (worksheet[cell].l && worksheet[cell].l.Target) {
            hyperlinks[cell] = worksheet[cell].l.Target;
          }
        });

        // Attach hyperlinks to the data
        return data.map((row: any, rowIndex: number) =>
          row.map((cell: any, colIndex: any) => {
            const cellAddress = XLSX.utils.encode_cell({
              r: rowIndex,
              c: colIndex,
            });
            return hyperlinks[cellAddress]
              ? { value: cell, hyperlink: hyperlinks[cellAddress] }
              : cell;
          })
        );
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
