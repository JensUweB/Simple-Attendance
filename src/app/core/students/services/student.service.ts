import {Injectable} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Group, GroupService} from '../../groups/services/group.service';

export interface Student {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    public studentsSubject: BehaviorSubject<Student[]>;
    private students: Student[];

    constructor(private groupService: GroupService) {
        this.studentsSubject = new BehaviorSubject<Student[]>([]);
        this.load();
    }

    /**
     * @returns an array of students
     */
    getStudents(): Student[] {
        return [...this.students];
    }

    /**
     * Adds a new student to the students array
     * @param student the student to add
     */
    addStudent(student: Student): boolean {
        this.students.push(student);
        this.save();
        return true;
    }

    /**
     * Removes a student
     * @param id the id of the student to remove
     */
    removeStudent(id: string) {
        this.students = this.students.filter(student => student.id !== id);
        this.save();
        const groups = this.groupService.getAllGroups();
        groups.forEach((group) => {
            group.students = group.students.filter((student) => student.id !== id);
            this.groupService.updateGroup(group);
        });
    }

    /**
     * Saves the students to local storage
     */
    save() {
        localStorage.setItem('students', JSON.stringify(this.students));
        this.studentsSubject.next(this.students);
    }

    /**
     * Loads the students from local storage
     */
    load() {
        this.students = JSON.parse(localStorage.getItem('students'));
        if (!this.students) {
            this.students = [];
        } else {
            this.students.forEach((student) => {
                student.createdAt = new Date(student.createdAt);
                student.updatedAt = new Date(student.updatedAt);
            });
        }
        this.studentsSubject.next(this.students);
    }
}
