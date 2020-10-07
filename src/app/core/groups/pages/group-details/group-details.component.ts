import {Component, OnInit} from '@angular/core';
import {Group, GroupService} from '../../services/group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Student, StudentService} from '../../../students/services/student.service';
import {Subscription} from 'rxjs';
import {AlertController} from '@ionic/angular';

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

    private studentsSub: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private groupService: GroupService,
        private studentService: StudentService,
        private alertCtrl: AlertController
    ) {
        const id = this.route.snapshot.paramMap.get('id');
        this.group = this.groupService.getGroupById(id);
        this.studentsSub = this.studentService.studentsSubject.subscribe((data) => {
            this.allStudents = data;
            this.initStudentsToAdd();
        });

        this.selectedStudents = [];
        this.group.students.forEach(student => this.selectedStudents.push(student.id));
    }

    ngOnInit() {
    }

    initStudentsToAdd() {
        this.studentsToAdd = this.allStudents.filter((student) => !this.group.students.some((item) => item.id === student.id));
        this.selectedStudents = [];
    }

    onSelectionChange() {
        if (!this.selectedStudents || this.selectedStudents.length <= 0) {
            return;
        }
        const canAdd = this.allStudents.filter(item => this.selectedStudents.some(id => id === item.id));
        this.group.students.push(...canAdd);
        this.save();
    }

    save() {
        this.groupService.updateGroup(this.group);
        this.initStudentsToAdd();
    }

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
                        this.groupService.removeGroup(this.group);
                        this.router.navigateByUrl('/groups');
                    }
                }
            ]
        });
        await alert.present();
    }

    async removeStudent(student: Student) {
        this.group.students = this.group.students.filter((item) => item.id !== student.id);
        this.save();
    }
}
