import { Component, OnInit, ViewChild} from '@angular/core';
import {Student, StudentService} from '../../services/student.service';
import {AnimationController} from '@ionic/angular';
import {Helper} from '../../../../shared/classes/helper.class';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss'],
})
export class StudentsListComponent implements OnInit {
  students: Student[];
  @ViewChild('nameInput') private studentInput;

  constructor(private studentService: StudentService, private animCtrl: AnimationController) {
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

  deleteStudent(id: string) {
    this.students = this.students.filter(student => student.id !== id);
    this.studentService.removeStudent(id);
  }

}
