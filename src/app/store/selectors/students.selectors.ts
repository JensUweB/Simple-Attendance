import { createSelector } from '@ngrx/store';
import { Student } from 'src/app/core/classes/student.class';
import { StudentsState, State } from '../reducers';

export const select = (state: State) => state.students;

export const students = createSelector<State, StudentsState, Student[]>(
  select,
  (state: StudentsState) => state.students
);
