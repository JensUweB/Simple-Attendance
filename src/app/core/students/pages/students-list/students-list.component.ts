import { Component, OnInit, ViewChild} from '@angular/core';
import {Student, StudentService} from '../../services/student.service';
import {AlertController, AnimationController} from '@ionic/angular';
import {Helper} from '../../../../shared/classes/helper.class';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss'],
})
export class StudentsListComponent implements OnInit {
  students: Student[];
  @ViewChild('nameInput') private studentInput;

  constructor(private studentService: StudentService, private alertCtrl: AlertController) {
    this.students = this.studentService.getStudents();
    // sort students by name asc
    this.sort();
  }

  ngOnInit() {}

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
}
