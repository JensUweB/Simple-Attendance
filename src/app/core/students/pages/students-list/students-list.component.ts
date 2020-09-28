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
  }

  ngOnInit() {}

  addStudent() {
    if (this.studentInput.value) {
      const student: Student = {
        id: Helper.uuid(),
        name: this.studentInput.value
      };
      this.studentService.addStudent(student);
      this.studentInput.value = null;
      this.students = this.studentService.getStudents();
    }
  }

  async deleteStudent(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm delete',
      message: 'Do you really want to delete this student? The archive is not affected by this.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Confirm',
          handler: () => {
            this.students = this.students.filter(student => student.id !== id);
            this.studentService.removeStudent(id);
          }
        }
      ]
    });
    await alert.present();
  }
}
