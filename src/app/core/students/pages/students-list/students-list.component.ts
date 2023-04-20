import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Helper } from '../../../../shared/classes/helper.class';
import { Subscription } from 'rxjs';
import { PrintService } from '../../../../shared/services/print.service';
import { Store } from '@ngrx/store';
import { GroupsSelector, StudentsSelector, TrainingsSelector } from 'src/app/store/selectors';
import { GroupsActions, StudentsActions } from 'src/app/store/actions';
import { Student } from 'src/app/core/classes/student.class';
import { Group } from 'src/app/core/classes/group.class';
import { Training } from 'src/app/core/classes/training.class';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss'],
})
export class StudentsListComponent implements OnInit, OnDestroy {
  public firstName: string;
  public lastName: string;
  public students: Student[];
  public groups: Group[];
  public trainings: Training[];

  private groupSub: Subscription;

  constructor(
    private readonly store: Store,
    private printService: PrintService,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.store.select(StudentsSelector.students).subscribe((students) => (this.students = students));
    this.store.select(GroupsSelector.groups).subscribe((groups) => (this.groups = groups));
    this.store.select(TrainingsSelector.trainings).subscribe((trainings) => (this.trainings = trainings));
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.groupSub) {
      this.groupSub.unsubscribe();
    }
  }

  /**
   * Creates a new student and adds it to the array
   */
  addStudent() {
    if (this.firstName && this.lastName) {
      const student: Student = {
        id: Helper.uuid(),
        displayName: this.firstName + ' ' + this.lastName,
        firstName: this.firstName,
        lastName: this.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.store.dispatch(StudentsActions.addStudent({ student }));
      this.firstName = null;
      this.lastName = null;
    }
  }

  /**
   * Opens an confirm modal and deletes a student from the array and all groups, if action is confirmed
   */
  async deleteStudent(student: Student) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm delete',
      message:
        'Do you really want to remove ' +
        student.displayName +
        '? This student will also get removed from all existing groups! This cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Confirm',
          handler: () => {
            this.store.dispatch(StudentsActions.removeStudent({ student }));
            this.store.dispatch(GroupsActions.removeStudent({ student }));
          },
        },
      ],
    });
    return alert.present();
  }

  /**
   * Returns the total number of groups the student is in
   * @param id the Identifier of the student
   */
  getStudentGroupsCount(id: string): number {
    let count = 0;
    this.groups.forEach((group) => {
      if (group.students.some((student) => student.id === id)) {
        count++;
      }
    });
    return count;
  }

  /**
   * Iterates through all attendance sessions and counts how often the given student
   * had a given status compared to the total attendance sessions of the student.
   * @param id the id of the student
   * @param status the status number to search for
   * @param inPercent should the return value be in percent, instead of an absolute value?
   * @return training status count (absolute or percent value)
   */
  getStudentTrainingCount(id: string, status: number, inPercent?): number {
    let totalCount = 0;
    let count = 0;
    this.trainings.forEach((training) => {
      training.students.forEach((item) => {
        if (item.student.id === id) {
          totalCount++;
          if (item.status === status) {
            count++;
          }
        }
      });
    });
    if (totalCount === 0) {
      return 0;
    }
    if (inPercent) {
      return (100 / totalCount) * count;
    }
    return count;
  }

  /**
   * Returns the student array as flattened object array and includes some statistic values
   * that are not inside the student objects by default
   */
  async flattenData() {
    // Flatten the data to fit into a table
    const flatData = [];
    if (this.students.length > 0) {
      for (const student of this.students) {
        flatData.push({
          ID: student.id,
          Name: student.displayName,
          GroupsNo: await this.getStudentGroupsCount(student.id),
          Attended: await this.getStudentTrainingCount(student.id, 1),
          NotCanceled: await this.getStudentTrainingCount(student.id, 0),
          Canceled: await this.getStudentTrainingCount(student.id, -1),
        });
      }
    }
    return flatData;
  }

  /**
   * Opens an action sheet with some actions
   */
  async toggleActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Export as CSV',
          icon: 'download',
          handler: () => this.csvExport(),
        },
        {
          text: 'Print',
          icon: 'print',
          handler: () => this.doPrint(),
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
        },
      ],
    });
    await actionSheet.present();
  }

  /**
   * Triggers printService.csvExport() for the student list
   */
  async csvExport() {
    this.printService.csvExport('Student List', await this.flattenData(), 'student-list');
  }

  /**
   * Triggers printService.pdfExport() for the student list
   */
  async doPrint() {
    const columns = ['ID', 'Name', 'GroupsNo', 'Attended', 'NotCanceled', 'Canceled'];
    const data = await this.getTableConformData();
    this.printService.pdfExport('Training Archive', columns, data);
  }

  /**
   * Returns the students list as two dimensional array, instead of an object array
   * and includes some statistic values that are not inside the student objects by default
   */
  async getTableConformData() {
    const data = [];
    this.students.forEach((student) => {
      data.push([
        student.id,
        student.displayName,
        this.getStudentGroupsCount(student.id),
        this.getStudentTrainingCount(student.id, 1),
        this.getStudentTrainingCount(student.id, 0),
        this.getStudentTrainingCount(student.id, -1),
      ]);
    });
    return data;
  }
}
