import { createAction, props } from "@ngrx/store";
import { Student } from "src/app/core/classes/student.class";

export const setStudents = createAction(
  "[Students] Set Students",
  props<{ students: Student[] }>()
);

export const addStudent = createAction(
  "[Students] Add Student",
  props<{ student: Student }>()
);

export const addStudents = createAction(
  "[Students] Add Students",
  props<{ students: Student[] }>()
);

export const updateStudent = createAction(
  "[Students] Update Student",
  props<{ student: Student }>()
);

export const removeStudent = createAction(
  "[Students] Remove Student",
  props<{ student: Student }>()
);
