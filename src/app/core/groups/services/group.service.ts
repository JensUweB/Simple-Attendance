import {Injectable} from '@angular/core';
import {Student} from '../../students/services/student.service';
import {Helper} from '../../../shared/classes/helper.class';
import {BehaviorSubject, Observable} from 'rxjs';
import { plainToClass } from 'class-transformer';

export class Group {
    id: string;
    name: string;
    students: Student[];
    createdAt: Date;
    updatedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class GroupService {
    private groups: Group[];
    private readonly groupsSubject: BehaviorSubject<Group[]>;

    constructor() {
        this.groupsSubject = new BehaviorSubject<Group[]>([]);
        this.load();
    }

    /**
     * Checks if the provided group already exists or not (by id) and adds it to the groups array
     * @param group the group object to add
     */
    addGroup(group: Group) {
        if (!this.groups.some(item => item.id === group.id)) {
            this.groups.push(group);
        }
        this.save();
    }

    getGroups(): Observable<Group[]> {
        return this.groupsSubject.asObservable();
    }

    /**
     * Create a new group
     * @param name the name of the group
     */
    createGroup(name: string) {
        const group: Group = {
            id: Helper.uuid(),
            name,
            students: [],
            createdAt: new Date(),
            updatedAt: new Date()
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
        this.groups.forEach((g) => {
            if (g.id === group.id) {
                g = group;
                g.updatedAt = new Date();
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
        this.groupsSubject.next(this.groups);
        console.log('GroupService groups: ', this.groups);
    }

    /**
     * Loads the data from local storage
     */
    load() {
        const data: any[] = JSON.parse(localStorage.getItem('groups'));
        this.groups = [];
        if (data) {
            this.groups = plainToClass(Group, data);
            this.groups.forEach((group) => {
                group.createdAt = new Date(group.createdAt);
                group.updatedAt = new Date(group.updatedAt);
            });
        }
        if (this.groupsSubject) {
            this.groupsSubject.next(this.groups);
        }
    }
}
