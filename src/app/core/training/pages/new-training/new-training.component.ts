import {Component, OnInit} from '@angular/core';
import {Training, TrainingService} from '../../services/training.service';
import {Helper} from '../../../../shared/classes/helper.class';
import {Group, GroupService} from '../../../groups/services/group.service';
import {Subscription} from 'rxjs';
import { ToastController } from '@ionic/angular';



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
      private trainingService: TrainingService,
      private groupService: GroupService,
      private toastController: ToastController,
  ) {
  }

  ngOnInit() {
    this.groupSub = this.groupService.getGroups().subscribe((data) => {
      this.groups = data;
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

  async saveTraining() {
    this.trainingService.addTraining(this.training);
    const toast = await this.toastController.create({
      message: 'Training session has been saved.',
      duration: 4000,
      color: 'success'
    });
    toast.present();
  }

  groupSelectChange() {
    this.selectedGroup = this.groupService.getAllGroups().filter((item) => item.id === this.groupId)[0];
  }
}
