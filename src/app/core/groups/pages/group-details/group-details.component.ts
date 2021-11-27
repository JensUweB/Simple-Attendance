import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { GroupsSelector, StudentsSelector } from 'src/app/store/selectors';
import { Student } from 'src/app/core/classes/student.class';
import { Group } from 'src/app/core/classes/group.class';
import { GroupsActions } from 'src/app/store/actions';

@Component({
    selector: 'app-group-details',
    templateUrl: './group-details.component.html',
    styleUrls: ['./group-details.component.scss'],
})
export class GroupDetailsComponent implements OnInit {
    public group: Group;
    public allStudents: Student[];
    public selectedStudents: string[];
    public studentsToAdd: Student[];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private readonly store: Store,
        private alertCtrl: AlertController
    ) {
        const id = this.route.snapshot.paramMap.get('id');
        this.store.select(GroupsSelector.groups).subscribe(groups => {
            this.group = groups.find(g => g.id === id);
        });
        this.store.select(StudentsSelector.students).subscribe((data) => {
            this.allStudents = data;
            this.initStudentsToAdd();
        });

        this.selectedStudents = [];
        this.group.students.forEach(student => this.selectedStudents.push(student.id));
    }

    ngOnInit() {
    }

    /**
     * Initializes the "add students select" options.
     * Only students that are not part of the group can be selected
     */
    initStudentsToAdd() {
        this.studentsToAdd = this.allStudents.filter((student) => !this.group.students.some((item) => item.id === student.id));
        this.selectedStudents = [];
    }

    /**
     * Adds the selected students to this group.
     */
    onSelectionChange() {
        if (!this.selectedStudents || this.selectedStudents.length <= 0) {
            return;
        }
        const students = this.allStudents.filter(item => this.selectedStudents.some(id => id === item.id));
        this.store.dispatch(GroupsActions.addStudents({group: this.group, students}));
    }

    /**
     * Opens an confirm modal and deletes this group, if action is confirmed.
     */
    async removeGroup() {
        const alert = await this.alertCtrl.create({
            header: 'Confirm delete',
            message: 'Do you really want to delete this group? The archive is not affected by this.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Confirm',
                    handler: () => {
                        this.store.dispatch(GroupsActions.removeGroup({group: this.group}));
                        this.router.navigateByUrl('/groups');
                    }
                }
            ]
        });
        await alert.present();
    }

    /**
     * Removes a student from this group and adds him to the "add students select"
     */
    async removeStudent(student: Student) {
        this.store.dispatch(GroupsActions.addStudent({group: this.group, student}));
    }
}
