import {Injectable} from '@angular/core';
import {ExportToCsv} from 'export-to-csv';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {File} from '@ionic-native/file/ngx';
import {Platform} from '@ionic/angular';
import * as PDFMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';

@Injectable({
    providedIn: 'root'
})
export class PrintService {
    public now = new Date();

    constructor(
        private androidPermissions: AndroidPermissions,
        private file: File,
        private platform: Platform,
    ) {
        // Bugfix for PDFMake
        (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    /**
     * Prints data in a table format
     * @param title The Title of the document
     * @param columnTitles The Name of the columns. Each column must have a title!
     * @param data The data to print as two dimensional array. data = [rows][cols]
     */
    pdfExport(title: string, columnTitles: string[], data: any[][]) {
        const docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            content: [
                {text: title, fontSize: 20},
                {
                    table: {
                        headerRows: columnTitles.length,
                        body: [
                            columnTitles,
                            ...data
                        ]
                    }
                }
            ]
        };
        if (this.platform.is('android')) {
            this.checkWritePermissions().then(() => {
                PDFMake.createPdf(docDefinition).getBlob((blob: Blob) => {
                    const path = this.file.externalRootDirectory + '/Download/';
                    this.checkWritePermissions().then(() => {
                        this.writeFile(blob, 'training-archive', '.pdf', 'PDF saved to: ' + path, path);
                    });
                });
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
    csvExport(title: string, data: any[], filename: string) {
        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: true,
            title,
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
        };
        const csvExporter = new ExportToCsv(options);
        if (this.platform.is('android')) {
            const file = csvExporter.generateCsv(data, true);
            const path = this.file.externalRootDirectory + '/Download/';
            this.checkWritePermissions().then(() => {
                this.writeFile(file, filename, '.csv', 'CSV saved to: ' + path, path);
            });
        } else {
            csvExporter.generateCsv(data);
        }
    }

    /**
     * Checks if app has permission to write to external storage.
     * If it has no permisison, permission is requestet.
     * Currently only supports android. Otherwise always resolves as true
     * @returns true if permission is granted
     */
    checkWritePermissions(): Promise<boolean> {
        return new Promise(((resolve, reject) => {
            if (this.platform.is('android')) {
                this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
                    .then((status) => {
                        if (status.hasPermission) {
                            resolve(true);
                        } else {
                            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
                                .then(() => resolve(true), (err) => reject(err));
                        }
                    }, (err) => reject(err));
            } else {
                resolve(true);
            }
        }));
    }

    /**
     * Writes a file to the file system. You need to request write permission separately.
     */
    writeFile(file: any, filename: string, fileExtension: string, alertMsg: string, path: string) {
        const dateStr = `${this.now.getFullYear()}-${this.now.getMonth()}-${this.now.getDate()}`;
        this.file.writeFile(path, `${filename}-${dateStr}${fileExtension}`,
            file, {replace: true, append: false})
            .then((result) => {
                    if (alertMsg) {
                        alert(alertMsg);
                    }
                },
                (error) => {
                    alert(error.message);
                });
    }
}
