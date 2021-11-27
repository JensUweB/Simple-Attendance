import {Component, OnDestroy, OnInit} from '@angular/core';
import {Helper} from '../../../../shared/classes/helper.class';
import {Observable, Subscription} from 'rxjs';
import {ToastController} from '@ionic/angular';
import { Group } from 'src/app/core/classes/group.class';
import { Store } from '@ngrx/store';
import { GroupsSelector } from 'src/app/store/selectors';
import { Training } from 'src/app/core/classes/training.class';
import { TrainingsActions } from 'src/app/store/actions';


@Component({
    selector: 'app-new-attendance',
    templateUrl: './new-attendance.component.html',
    styleUrls: ['./new-attendance.component.scss'],
})
export class NewAttendanceComponent implements OnInit, OnDestroy {
    public currentDate = new Date(Date.now());
    public selectedDate: Date;
    public selectedGroup: Group;
    public groupId: string;
    public groups$: Observable<Group[]>;
    public training: Training;


    constructor(
        private readonly store: Store,
        private toastController: ToastController,
    ) {
        this.groups$ = this.store.select(GroupsSelector.groups);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    /**
     * Creates a new attendance session with the selected group
     */
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

    /**
     * Saves the attendance object and shows an toast notification
     */
    async saveTraining() {
        this.store.dispatch(TrainingsActions.addTraining({training: this.training}));
        const toast = await this.toastController.create({
            message: 'Training session has been saved.',
            duration: 4000,
            color: 'success'
        });
        this.training = undefined;
        this.selectedDate = undefined;
        this.selectedGroup = undefined;
        await toast.present();
    }

    async groupSelectChange() {
        this.groups$.subscribe(groups => this.selectedGroup = groups.find((item) => item.id === this.groupId));
    }
}
