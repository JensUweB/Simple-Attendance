import { Helper } from 'src/app/shared/classes/helper.class';
import { Student } from './student.class';

export class Group {
    id: string;
    name: string;
    students: Student[];
    createdAt: Date;
    updatedAt: Date;

    constructor(input) {
        if (!input.name) { throw new Error('Input property "name" is required.'); }
        this.id = input.id ? input.id : Helper.uuid();
        this.name = input.name;
        this.students = input.students ? input.students : [];
        this.createdAt = input.createdAt ? input.createdAt : new Date();
        this.updatedAt = new Date();
    }
}
