import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Student, StudentService} from '../../services/student.service';
import {AlertController} from '@ionic/angular';
import {Helper} from '../../../../shared/classes/helper.class';
import { Group, GroupService } from 'src/app/core/groups/services/group.service';
import { Subscription } from 'rxjs';
import {TrainingService} from '../../../training/services/training.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss'],
})
export class StudentsListComponent implements OnInit, OnDestroy {
  @ViewChild('nameInput') private studentInput;
  public students: Student[];
  public groups: Group[];

  private groupSub: Subscription;

  constructor(
    private studentService: StudentService,
    private groupService: GroupService,
    private trainingService: TrainingService,
    private alertCtrl: AlertController
  ) {
    this.students = this.studentService.getStudents();
    // sort students by name asc
    this.sort();
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

  addStudent() {
    if (this.studentInput.value) {
      const student: Student = {
        id: Helper.uuid(),
        name: this.studentInput.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.studentService.addStudent(student);
      this.studentInput.value = null;
      this.students = this.studentService.getStudents();
      this.sort();
    }
  }

  sort() {
    this.students.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else if (a.name === b.name) {
        return 0;
      } else {
        return -1;
      }
    });
  }

  async deleteStudent(student: Student) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm delete',
      message: 'Do you really want to remove ' + student.name +'? This student will also get removed from all existing groups! This cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Confirm',
          handler: () => {
            this.students = this.students.filter((item) => item.id !== student.id);
            this.studentService.removeStudent(student.id);
          }
        }
      ]
    });
    await alert.present();
  }

  getStudentGroupsCount(id: string): number {
    let count = 0;
    this.groups.forEach((group) => {
      if (group.students.some((student) => student.id === id)) {
        count ++;
      }
    });
    return count;
  }

  /**
   * Iterates through all training sessions and counts how often the given student
   * had a given status compared to the total training sessions of the student.
   * @param id the id of the student
   * @param status the status number to search for
   * @return training status count in percent
   */
  getStudentTrainingCountPercent(id: string, status: number): number {
    const trainings = this.trainingService.getTrainings();
    let totalCount = 0;
    let count = 0;
    trainings.forEach((training) => {
      training.students.forEach((item) => {
        if (item.student.id === id) {
          totalCount ++;
          if (item.status === status) {
            count ++;
          }
        }
      });
    });
    if (totalCount === 0) { return 0; }
    return 100 / totalCount * count;
  }
}
