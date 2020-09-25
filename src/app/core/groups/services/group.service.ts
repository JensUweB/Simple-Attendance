import { Injectable } from '@angular/core';
import {Student} from '../../students/services/student.service';
import {Helper} from '../../../shared/classes/helper.class';
import {BehaviorSubject} from 'rxjs';

export interface Group {
  id: string;
  name: string;
  students: Student[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groups: Group[];
  public groupsSubject: BehaviorSubject<Group[]>;

  constructor() {
    this.groupsSubject = new BehaviorSubject<Group[]>([]);
    this.load();
  }

  /**
   * Checks if the provided group already exists or not (by id) and adds it to the groups array
   * @param group the group object to add
   */
  addGroup(group: Group) {
    if (!this.groups.some(item => item.id === group.id))  {
      this.groups.push(group);
    }
    this.save();
  }

  /**
   * Create a new group
   * @param name the name of the group
   */
  createGroup(name: string) {
    const group: Group = {
      id: Helper.uuid(),
      name,
      students: []
    };
    this.addGroup(group);
    return group;
  }

  /**
   * Remove a group from the groups array
   * @param group the group object to remove
   */
  async removeGroup(group: Group) {
    this.groups = await this.groups.filter(item => item.id !== group.id);
    this.save();
  }

  /**
   * Updates an already existing group object.
   * Returns false if provided group does not exist in array
   * @param group the group object to update
   */
  updateGroup(group: Group) {
    let found = false;
    this.groups.forEach(g => {
      if (g.id === group.id) {
        g = group;
        found = true;
      }
    });
    this.save();
    return found;
  }

  /**
   * Returns an array with all stored groups
   */
  getAllGroups() {
    return [...this.groups];
  }

  /**
   * Returns a single group object, if a group with the given id exists.
   * Otherwise it will return null
   * @param id the group id to search for
   */
  getGroupById(id: string) {
    const result = this.groups.filter(group => group.id === id);
    if (result && result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  }

  /**
   * Saves the data to local storage
   */
  save() {
    localStorage.setItem('groups', JSON.stringify(this.groups));
    console.log('EMITTING NEW GROUPS Arr!');
    this.groupsSubject.next(this.groups);
  }

  /**
   * Loads the data from local storage
   */
  load() {
    const data = localStorage.getItem('groups');
    if (data) {
      this.groups = JSON.parse(data);
    } else {
      this.groups = [];
    }
    this.groupsSubject.next(this.groups);
  }
}
