import { createReducer, on } from "@ngrx/store";
import { Student } from "src/app/core/classes/student.class";
import { StudentsActions } from "../actions";

export interface StudentsState {
  students: Student[];
}

export const initialState: StudentsState = {
  students: [],
};

export const studentsReducer = createReducer(
  initialState,
  on(StudentsActions.setStudents, (state, { students }) => ({
    ...state,
    students,
  })),
  on(StudentsActions.addStudents, (state, { students }) => ({
    ...state,
    students: [
      ...state.students.filter((s) => !students.some((b) => b.id === s.id)),
      ...students,
    ],
  })),
  on(StudentsActions.addStudent, (state, { student }) => ({
    ...state,
    students: state.students.concat(student),
  })),
  on(StudentsActions.removeStudent, (state, { student }) => ({
    ...state,
    students: state.students.filter((s) => s.id !== student.id),
  })),
  on(StudentsActions.updateStudent, (state, { student }) => ({
    ...state,
    students: state.students.map((s) => (s.id === student.id ? student : s)),
  }))
);
