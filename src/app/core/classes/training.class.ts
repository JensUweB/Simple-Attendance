import { Student } from './student.class';

export class Training {
    id: string = undefined;
    students: {
      student: Student,
      status: number
    }[] = undefined;
    group: {
      id: string,
      name: string
    } = undefined;
    datetime: Date = undefined;

    constructor(input?: any) {
        if (input) {
            for (const key of Object.keys(this)) {
                this[key] = input[key];
            }
        }
    }
}
