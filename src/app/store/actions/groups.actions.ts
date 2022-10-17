import { createAction, props } from "@ngrx/store";
import { Group } from "src/app/core/classes/group.class";
import { Student } from "src/app/core/classes/student.class";

export const setGroups = createAction(
  "[Groups] Set Groups",
  props<{ groups: Group[] }>()
);

export const addGroup = createAction(
  "[Groups] Add Group",
  props<{ group: Group }>()
);

export const addGroups = createAction(
  "[Groups] Add Groups",
  props<{ groups: Group[] }>()
);

export const updateGroup = createAction(
  "[Groups] Update Group",
  props<{ group: Group }>()
);

export const removeGroup = createAction(
  "[Groups] Remove Group",
  props<{ group: Group }>()
);

export const addStudent = createAction(
  "[Groups] Add Student",
  props<{ group: Group; student: Student }>()
);

export const addStudents = createAction(
  "[Groups] Add Students",
  props<{ group: Group; students: Student[] }>()
);

export const removeStudent = createAction(
  "[Groups] Remove Student",
  props<{ student: Student }>()
);
