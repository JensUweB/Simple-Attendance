import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {StudentService} from '../../../students/services/student.service';
import {Training, TrainingService} from '../../services/training.service';
import {Helper} from '../../../../shared/classes/helper.class';
import {Group, GroupService} from '../../../groups/services/group.service';
import {Subscription} from 'rxjs';



@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  public currentDate = new Date(Date.now());
  public selectedDate: Date;
  public selectedGroup: Group;
  public groupId: string;
  public groups: Group[];
  public training: Training;

private groupSub: Subscription;

  constructor(
      private studentService: StudentService,
      private trainingService: TrainingService,
      public groupService: GroupService,
  ) {
  }

  ngOnInit() {
    this.groupSub = this.groupService.getGroups().subscribe((data) => {
      this.groups = data;
      console.log('Got new groups data!');
    });
  }

  startTraining() {
    const arr = [];
    this.selectedGroup.students.forEach(student => {
      arr.push({student, status: 0});
    });
    this.training = {
      id: Helper.uuid(),
      students: arr,
      group: {
        id: this.selectedGroup.id,
        name: this.selectedGroup.name
      },
      datetime: this.selectedDate
    };
  }

  saveTraining() {
    this.trainingService.addTraining(this.training);
  }

  groupSelectChange() {
    this.selectedGroup = this.groups.filter((item) => item.id === this.groupId)[0];
  }
}
