import {Component, OnDestroy, OnInit} from '@angular/core';
import {Training, TrainingService} from '../../services/training.service';
import {Helper} from '../../../../shared/classes/helper.class';
import {Group, GroupService} from '../../../groups/services/group.service';
import {Subscription} from 'rxjs';
import {ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';


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
    public groups: Group[];
    public training: Training;

    private readonly groupSub: Subscription;

    constructor(
        public translate: TranslateService,
        private trainingService: TrainingService,
        private groupService: GroupService,
        private toastController: ToastController,
    ) {
        this.groupSub = this.groupService.getGroups().subscribe((data) => {
            this.groups = data;
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        if (this.groupSub) {
            this.groupSub.unsubscribe();
        }
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
        this.trainingService.addTraining(this.training);
        const toast = await this.toastController.create({
            message: this.translate.instant('NewAttendance.SaveSuccess'),
            duration: 4000,
            color: 'success'
        });
        await toast.present();
    }

    groupSelectChange() {
        this.selectedGroup = this.groupService.getAllGroups().filter((item) => item.id === this.groupId)[0];
    }
}
