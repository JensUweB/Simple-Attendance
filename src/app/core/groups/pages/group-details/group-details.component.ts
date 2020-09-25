import {Component, OnInit} from '@angular/core';
import {Group, GroupService} from '../../services/group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Student, StudentService} from '../../../students/services/student.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
})
export class GroupDetailsComponent implements OnInit {
  public group: Group;
  public allStudents: Student[];
  public selectedStudents: string[];

  private studentsSub: Subscription;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private groupService: GroupService,
      private studentService: StudentService) {
    const id = this.route.snapshot.paramMap.get('id');
    this.group = this.groupService.getGroupById(id);
    this.studentsSub = this.studentService.studentsSubject.subscribe((data) => this.allStudents = data);

    this.selectedStudents = [];
    this.group.students.forEach(student => this.selectedStudents.push(student.id));
  }

  ngOnInit() {}

  onSelectionChange() {
    if (!this.selectedStudents || this.selectedStudents.length <= 0) { return; }
    this.group.students = this.allStudents.filter(item => this.selectedStudents.some(id => id === item.id));
    this.save();
  }

  save() {
    this.groupService.updateGroup(this.group);
  }

  removeGroup() {
    this.groupService.removeGroup(this.group);
    this.router.navigateByUrl('/groups');
  }
}
