import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { GroupsSelector } from 'src/app/store/selectors';
import { GroupsActions } from 'src/app/store/actions';
import { Helper } from 'src/app/shared/classes/helper.class';
import { Group } from 'src/app/core/classes/group.class';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit, OnDestroy {
  public showGroupInput = false;
  public groupName: string;
  public groups$: Observable<Group[]>;

  constructor(private readonly store: Store, private modalController: ModalController) {
    this.groups$ = this.store.select(GroupsSelector.groups);
  }

  ngOnInit() {}

  ngOnDestroy() {}

  /**
   * Shows or hides the add group input
   */
  toggleGroupInput() {
    this.showGroupInput = !this.showGroupInput;
  }

  /**
   * Creates a new group & adds it to the groups array
   */
  createGroup() {
    this.toggleGroupInput();
    if (!this.groupName) {
      return;
    }
    const group: Group = {
      id: Helper.uuid(),
      name: this.groupName,
      students: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.store.dispatch(GroupsActions.addGroup({ group }));
    this.groupName = null;
  }

  /**
   * removes an existing group
   */
  removeGroup(group: Group) {
    this.store.dispatch(GroupsActions.removeGroup({ group }));
  }
}
