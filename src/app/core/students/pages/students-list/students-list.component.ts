import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Student, StudentService} from '../../services/student.service';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {Helper} from '../../../../shared/classes/helper.class';
import {Group, GroupService} from 'src/app/core/groups/services/group.service';
import {Subscription} from 'rxjs';
import {TrainingService} from '../../../attendance/services/training.service';
import {PrintService} from '../../../../shared/services/print.service';

@Component({
    selector: 'app-students-list',
    templateUrl: './students-list.component.html',
    styleUrls: ['./students-list.component.scss'],
})
export class StudentsListComponent implements OnInit, OnDestroy {
    @ViewChild('nameInput') private studentInput;
    public students: Student[];
    public groups: Group[];

    private groupSub: Subscription;

    constructor(
        private studentService: StudentService,
        private groupService: GroupService,
        private trainingService: TrainingService,
        private printService: PrintService,
        private alertCtrl: AlertController,
        private actionSheetCtrl: ActionSheetController,
    ) {
        this.students = this.studentService.getStudents();
        // sort students by name asc
        this.sort();
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
     * Creates a new student and adds it to the array
     */
    addStudent() {
        if (this.studentInput.value) {
            const student: Student = {
                id: Helper.uuid(),
                name: this.studentInput.value,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            this.studentService.addStudent(student);
            this.studentInput.value = null;
            this.students = this.studentService.getStudents();
            this.sort();
        }
    }

    /**
     * Sorts the student list ascending by name
     */
    sort() {
        this.students.sort((a, b) => {
            if (a.name > b.name) {
                return 1;
            } else if (a.name === b.name) {
                return 0;
            } else {
                return -1;
            }
        });
    }

    /**
     * Opens an confirm modal and deletes a student from the array and all groups, if action is confirmed
     */
    async deleteStudent(student: Student) {
        const alert = await this.alertCtrl.create({
            header: 'Confirm delete',
            message: 'Do you really want to remove ' + student.name + '? This student will also get removed from all existing groups! This cannot be undone.',
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
                        this.students = this.students.filter((item) => item.id !== student.id);
                        this.studentService.removeStudent(student.id);
                    }
                }
            ]
        });
        return alert.present();
    }

    /**
     * Returns the total number of groups the student is in
     * @param id the Identifier of the student
     */
    getStudentGroupsCount(id: string): number {
        let count = 0;
        this.groups.forEach((group) => {
            if (group.students.some((student) => student.id === id)) {
                count++;
            }
        });
        return count;
    }

    /**
     * Iterates through all attendance sessions and counts how often the given student
     * had a given status compared to the total attendance sessions of the student.
     * @param id the id of the student
     * @param status the status number to search for
     * @param inPercent should the return value be in percent, instead of an absolute value?
     * @return training status count (absolute or percent value)
     */
    getStudentTrainingCount(id: string, status: number, inPercent?): number {
        const trainings = this.trainingService.getTrainings();
        let totalCount = 0;
        let count = 0;
        trainings.forEach((training) => {
            training.students.forEach((item) => {
                if (item.student.id === id) {
                    totalCount++;
                    if (item.status === status) {
                        count++;
                    }
                }
            });
        });
        if (totalCount === 0) {
            return 0;
        }
        if (inPercent) {
            return 100 / totalCount * count;
        }
        return count;
    }

    /**
     * Returns the student array as flattened object array and includes some statistic values
     * that are not inside the student objects by default
     */
    flattenData() {
        // Flatten the data to fit into a table
        const flatData = [];
        if (this.students.length > 0) {
            this.students.forEach((student) => {
                flatData.push(
                    {
                        ID: student.id,
                        Name: student.name,
                        GroupsNo: this.getStudentGroupsCount(student.id),
                        Attended: this.getStudentTrainingCount(student.id, 1),
                        NotCanceled: this.getStudentTrainingCount(student.id, 0),
                        Canceled: this.getStudentTrainingCount(student.id, -1),
                    }
                );
            });
        }
        return flatData;
    }

    /**
     * Opens an action sheet with some actions
     */
    async toggleActionSheet() {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Actions',
            buttons: [
                {
                    text: 'Export as CSV',
                    icon: 'download',
                    handler: () => this.csvExport()
                },
                {
                    text: 'Print',
                    icon: 'print',
                    handler: () => this.doPrint()
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'close'
                }
            ]
        });
        await actionSheet.present();
    }

    /**
     * Triggers printService.csvExport() for the student list
     */
    csvExport() {
        this.printService.csvExport('Student List', this.flattenData(), 'student-list');
    }

    /**
     * Triggers printService.pdfExport() for the student list
     */
    doPrint() {
        const columns = ['ID', 'Name', 'GroupsNo', 'Attended', 'NotCanceled', 'Canceled'];
        const data = this.getTableConformData();
        this.printService.pdfExport('Training Archive', columns, data);
    }

    /**
     * Returns the students list as two dimensional array, instead of an object array
     * and includes some statistic values that are not inside the student objects by default
     */
    getTableConformData() {
        const data = [];
        this.students.forEach((student) => {
            data.push([
                student.id,
                student.name,
                this.getStudentGroupsCount(student.id),
                this.getStudentTrainingCount(student.id, 1),
                this.getStudentTrainingCount(student.id, 0),
                this.getStudentTrainingCount(student.id, -1),
            ]);
        });
        return data;
    }
}
