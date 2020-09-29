import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Group, GroupService} from '../../services/group.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit, OnDestroy {
  public showGroupInput = false;
  public groupName: string;
  public groups: Group[];

  private readonly groupSub: Subscription;

  constructor(private groupService: GroupService, private modalController: ModalController) {
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

  toggleGroupInput() {
    this.showGroupInput = !this.showGroupInput;
  }

  createGroup() {
    this.toggleGroupInput();
    if (!this.groupName) {
      return;
    }
    const group = this.groupService.createGroup(this.groupName);
    this.groupName = null;
  }

  removeGroup(group: Group) {
    this.groupService.removeGroup(group);
  }
}
