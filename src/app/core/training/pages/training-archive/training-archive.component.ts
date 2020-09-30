import {Component, OnInit} from '@angular/core';
import {Training, TrainingService} from '../../services/training.service';
import {ActionSheetController, AlertController, Platform} from '@ionic/angular';
import {ExportToCsv} from 'export-to-csv';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as PDFMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';

@Component({
  selector: 'app-training-archive',
  templateUrl: './training-archive.component.html',
  styleUrls: ['./training-archive.component.scss'],
})
export class TrainingArchiveComponent implements OnInit {
  public trainings: Training[] = [];
  public printView = false;

  constructor(
      private trainingService: TrainingService,
      private alertCtrl: AlertController,
      private actionSheetCtrl: ActionSheetController,
      private platform: Platform,
      private file: File,
      private socialSharing: SocialSharing,
  ) {
    // Bugfix for PDFMake
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;

    this.trainings = this.trainingService.getTrainings();
  }

  ngOnInit() {}

  toggleList(id: string) {
    const eleContent = document.getElementById('content-' + id);
    const eleCard = document.getElementById('card-' + id);
    if (eleContent.classList.contains('ion-hide')) {
      eleContent.classList.remove('ion-hide');
    } else {
      eleContent.classList.add('ion-hide');
    }
  }

  async removeTraining(training: Training) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm delete',
      message: 'Do you really want to delete this archive entry? This cannot be undone!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Confirm',
          handler: () => {
            this.trainings = this.trainings.filter(item => item.datetime !== training.datetime);
            this.trainingService.removeTraining(training);
          }
        }
      ]
    });
    await alert.present();
  }

  countStatus(training: Training, status: number) {
    let count = 0;
    training.students.forEach((student) => {
      if (student.status === status) { count ++; }
    });
    return count;
  }

  async toggleActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Export as CSV',
          icon: 'download',
          handler: () => this.csvExport()
        },
        {
          text: 'Print',
          icon: 'print',
          handler: () => { this.doPrint(); }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close'
        }
      ]
    });
    await actionSheet.present();
  }

  csvExport() {
    // Flatten the data to fit into a table
    const flatData = this.flattenData();
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Training Archive Export',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);

    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      const file = csvExporter.generateCsv(flatData, true);
      const blob = new Blob([file], {type: 'text/csv'});
      const path = this.file.externalApplicationStorageDirectory;
      this.file.writeFile(path, 'archive.csv', file, {replace: true, append: false})
          .then((result) => {
            alert('CSV saved to: ' + path);
            // this.socialSharing.share(null, 'archive.csv', 'archive.csv',file);
            },
              (error) => { alert(error.message); });
    } else {
      csvExporter.generateCsv(flatData);
    }
  }

  doPrint() {
      const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        content: [
          { text: 'Training Overview', fontSize: 20 },
          {
            table: {
              headerRows: 6,
              body: [
                  ['ID', 'Group Name', 'Date', 'Student Name', 'Student Status'],
                      ...this.getDataAsArray()
              ]
            }
          }
        ]
      };
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      PDFMake.createPdf(docDefinition).getBlob((blob) => {
      const path = this.file.externalApplicationStorageDirectory;
        this.file.writeFile(path, 'archive.pdf', blob, {replace: true, append: false})
        .then((result) => {
          alert('PDF saved to: ' + path);
          },
          (error) => { alert(error.message); });
      });
    } else {
      PDFMake.createPdf(docDefinition).download();
    }
    this.printView = false;
  }

  /**
   * Returns the training array as flattened object array without any nested objects / arrays
   */
  flattenData() {
    // Flatten the data to fit into a table
    const flatData = [];
    this.trainings.forEach((training) => {
      training.students.forEach((item) => {
        flatData.push(
            {
              ID: training.id,
              GroupName: training.group.name,
              Date: training.datetime,
              StudentId: item.student.id,
              StudentName: item.student.name,
              StudentStatus: item.status
            }
        );
      });
    });
    return  flatData;
  }

  /**
   * Returns the trainig array as flattened two dimensional string array
   * for easier use in tables
   */
  getDataAsArray() {
    // Flatten the data to fit into a table
    const flatData = [];
    this.trainings.forEach((training) => {
      training.students.forEach((item) => {
        flatData.push(
            [
              training.id,
              training.group.name,
              training.datetime.toString(),
              item.student.name,
              item.status + ''
            ]
        );
      });
    });
    return  flatData;
  }
}


