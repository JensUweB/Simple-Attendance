import { Group } from './group.class';
import { Student } from './student.class';

export class Training {
  id: string = undefined;
  students: {
    student: Student;
    status: number;
  }[] = undefined;
  group: Group = undefined;
  datetime: Date = undefined;

  constructor(input?: any) {
    if (input) {
      for (const key of Object.keys(this)) {
        this[key] = input[key];
      }
    }
  }
}
