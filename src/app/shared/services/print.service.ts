import { Injectable } from '@angular/core';
import type { PermissionState } from '@capacitor/core';
import { saveAs } from 'file-saver';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import * as PDFMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  public now = new Date();

  constructor(private platform: Platform) {
    // Bugfix for PDFMake
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  /**
   * Prints data in a table format
   * @param title The Title of the document
   * @param columnTitles The Name of the columns. Each column must have a title!
   * @param data The data to print as two dimensional array. data = [rows][cols]
   */
  async pdfExport(title: string, columnTitles: string[], data: any[][]) {
    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      content: [
        { text: title, fontSize: 20 },
        {
          table: {
            headerRows: columnTitles.length,
            body: [columnTitles, ...data],
          },
        },
      ],
    };
    if (this.platform.is('android')) {
      await this.checkWritePermissions();
      PDFMake.createPdf(docDefinition).getBlob(async (blob: Blob) => {
        const path = 'simple-attendance-archive.pdf';
        await this.writeFile(path, Directory.Documents, blob)
          .then(() => alert('PDF saved to: ' + path))
          .catch((err) => console.warn('[PrintService] Error while writing pdf:', err));
      });
    } else {
      PDFMake.createPdf(docDefinition).download();
    }
  }

  /**
   * Exports data in csv format. Object properties will be used as column titles!
   * @param title Title of the document
   * @param data Data as object array. Ex: [ { Name: 'John',  Age: '40' } ]
   * @param filename Name of the file
   */
  async csvExport(title: string, data: any[], filename: string) {
    switch (Capacitor.getPlatform()) {
      case 'ios':
      case 'android':
        const file = this.generateCSV(data, false);
        const path = 'attendance.csv';
        await this.checkWritePermissions();
        await this.writeFile(path, Directory.Documents, file)
          .then(() => alert('CSV saved to: ' + path))
          .catch((err) => console.warn('[PrintService] Error while writing CSV:', err));
        break;
      default:
        const blob = this.generateCSV(data, true);
        saveAs(blob, filename + '.csv');
        break;
    }
  }

  generateCSV(dataArray: any[], asBlob = true): Blob | string {
    if (!dataArray || !dataArray.length) {
      console.error('[PrintService] Data array is empty or not provided.');
      return;
    }

    // Create a header row for the CSV file
    const header = Object.keys(dataArray[0]).join(',');

    // Create the CSV content by joining the data rows
    const csvContent = dataArray
      .map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(',')
      )
      .join('\n');

    // Combine header and content
    const csv = `${header}\n${csvContent}`;

    if (asBlob) {
      // Create a Blob with the CSV content and save it as a file
      return new Blob([csv], { type: 'text/csv;charset=utf-8' });
    }
    return csv;
  }

  /**
   * Checks if app has permission to write to external storage.
   * If it has no permisison, permission is requestet.
   * Currently only supports android. Otherwise always resolves as true
   * @returns true if permission is granted
   */
  async checkWritePermissions(): Promise<boolean> {
    switch (Capacitor.getPlatform()) {
      case 'ios':
      case 'android':
        let status = await Filesystem.checkPermissions();
        if (status.publicStorage !== 'granted') {
          status = await Filesystem.requestPermissions();
          return status.publicStorage === 'granted';
        }
        return status.publicStorage === 'granted';
      default:
        return true;
    }
  }

  /**
   * Writes a file to the file system. You need to request write permission separately.
   */
  async writeFile(path: string, directory: Directory, data: any) {
    await Filesystem.writeFile({
      path,
      data,
      directory,
      encoding: Encoding.UTF8,
    });
  }
}
