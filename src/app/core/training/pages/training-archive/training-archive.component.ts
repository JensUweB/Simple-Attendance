import {Component, OnDestroy, OnInit} from '@angular/core';
import {Training, TrainingService} from '../../services/training.service';
import {ActionSheetController, AlertController, Platform} from '@ionic/angular';
import {ExportToCsv} from 'export-to-csv';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as PDFMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { Group, GroupService } from 'src/app/core/groups/services/group.service';
import { Subscription } from 'rxjs';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-training-archive',
  templateUrl: './training-archive.component.html',
  styleUrls: ['./training-archive.component.scss'],
})
export class TrainingArchiveComponent implements OnInit, OnDestroy {
  public printView = false;
  public trainings: Training[] = [];
  public filteredTrainings: Training[] = [];
  public groups: Group[] = [];
  public groupFilter: string;
  public now = new Date();
  // public minDateFilter: Date = new Date('2020-10-02');

  private groupSub: Subscription;

  constructor(
      private trainingService: TrainingService,
      private groupService: GroupService,
      private alertCtrl: AlertController,
      private actionSheetCtrl: ActionSheetController,
      private platform: Platform,
      private file: File,
      private socialSharing: SocialSharing,
      private androidPermissions: AndroidPermissions
  ) {
    // Bugfix for PDFMake
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;

    this.trainings = this.trainingService.getTrainings();
    this.filteredTrainings = this.trainings;
    this.groupSub = this.groupService.getGroups().subscribe((data) => {
      this.groups = data;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.groupSub) {
      this.groupSub.unsubscribe();
    }
  }

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

  /**
   * Exports filteredTrainings in csv format
   */
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
      const path = this.file.externalRootDirectory + '/Download/';
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
          .then((status) => {
            if (status.hasPermission) {
              this.file.writeFile(path, `training-archive-${this.now.getFullYear()}-${this.now.getMonth()}-${this.now.getDate()}.csv`,
                  file, {replace: true, append: false})
                  .then((result) => {
                        alert('CSV saved to: ' + path);
                        // this.socialSharing.share(null, 'archive.csv', 'archive.csv',file);
                      },
                      (error) => { alert(error.message); });
            } else {
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
                  .then(() => {
                    this.file.writeFile(path, `training-archive-${this.now.getFullYear()}-${this.now.getMonth()}-${this.now.getDate()}.csv`,
                        file, {replace: true, append: false})
                        .then((result) => {
                              alert('CSV saved to: ' + path);
                              // this.socialSharing.share(null, 'archive.csv', 'archive.csv',file);
                            },
                            (error) => { alert(error.message); });
                  });
            }
          });
    } else {
      csvExporter.generateCsv(flatData);
    }
  }

  /**
   * Prints filteredTrainings in table format as PDF
   */
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
      PDFMake.createPdf(docDefinition).getBlob((blob: Blob) => {
      const path = this.file.externalRootDirectory + '/Download/';
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then((status) => {
              if (status.hasPermission) {
                this.file.writeFile(path, `training-archive-${this.now.getFullYear()}-${this.now.getMonth()}-${this.now.getDate()}.pdf`,
                    blob, {replace: true, append: false})
                    .then((result) => {
                          alert('PDF saved to: ' + path);
                        },
                        (error) => { alert(error.message); });
              } else {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
                    .then(() => {
                      this.file.writeFile(path, `training-archive-${this.now.getFullYear()}-${this.now.getMonth()}-${this.now.getDate()}.pdf`,
                          blob, {replace: true, append: false})
                          .then((result) => {
                                alert('PDF saved to: ' + path);
                              },
                              (error) => { alert(error.message); });
                    });
              }
            });
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
    if (this.filteredTrainings.length > 0) {
      this.filteredTrainings.forEach((training) => {
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
    }
    return  flatData;
  }

  /**
   * Returns the trainig array as flattened two dimensional string array
   * for easier use in tables
   */
  getDataAsArray() {
    // Flatten the data to fit into a table
    const flatData = [];
    if (this.filteredTrainings.length > 0) {
      this.filteredTrainings.forEach((training) => {
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
    }
    return  flatData;
  }

  /**
   * Sets the selected groupFilter value and runs applyFilters()
   * @param event ion-select event object
   */
  setGroupFilter(event) {
    this.groupFilter = event.detail.value;
    this.applyFilters();
  }

  /**
   * Applies all filters onto trainings array one after another
   */
  applyFilters() {
    this.filteredTrainings = [...this.trainings];
    if (this.groupFilter && this.groupFilter !== '') {
      this.filteredTrainings = this.filteredTrainings.filter((training) => training.group.id === this.groupFilter);
    }
    /* if (this.minDateFilter) {
      this.filteredTrainings = this.filteredTrainings.filter((training) => training.datetime.getTime() >= this.minDateFilter.getTime());
    } */
  }
}


