import { Component, OnInit} from '@angular/core';
import {Training, TrainingService} from '../../services/training.service';
import {ActionSheetController, AlertController, Platform} from '@ionic/angular';
import {ExportToCsv} from 'export-to-csv';
import {Downloader, DownloadRequest, NotificationVisibility} from '@ionic-native/downloader/ngx';
import { File } from '@ionic-native/file/ngx';

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
      private downloader: Downloader,
      private file: File,
  ) {
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
          handler: () => { this.printView = true; this.doPrint(); }
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
          .then((result) => { alert('CSV saved to: ' + path); },
              (error) => { alert(error.message); });
    } else {
      csvExporter.generateCsv(flatData);
    }
  }

  doPrint() {
    this.printView = false;
    /*
    this.printer.isAvailable().then((onSuccess) => {
      const options: PrintOptions = {
        name: 'Training Archive',
        duplex: true,
        orientation: 'landscape',
        monochrome: false
      };
      this.printer.print(document.getElementById('container'), options).then(() => this.printView = false);
    });
     */
  }
}
