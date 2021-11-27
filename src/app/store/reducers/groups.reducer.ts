import {createReducer, on} from '@ngrx/store';
import { Group } from 'src/app/core/classes/group.class';
import {GroupsActions } from '../actions';

export interface GroupsState {
  groups: Group[];
}

export const initialState: GroupsState = {
    groups: [],
};

export const groupsReducer = createReducer(
  initialState,
  on(GroupsActions.setGroups, (state, {groups}) => ({...state, groups})),
  on(GroupsActions.addGroup, (state, {group}) => ({...state, groups: !state.groups ? [group] : state.groups.concat(group)})),
  on(GroupsActions.removeGroup, (state, {group}) => ({...state, groups: state.groups.filter((g) => g.id !== group.id)})),
  on(GroupsActions.updateGroup, (state, {group}) => ({
    ...state,
    groups: state.groups.map(g => g.id === group.id ? group : g)
  })),
  on(GroupsActions.addStudent, (state, {group, student}) => ({
      ...state,
      groups: state.groups.map(g => {
          if (g.id === group.id) {
              if (!g.students.some(s => s.id === student.id)) {
                const grp = new Group({...g, students: [...g.students, student]});
                return grp;
              }
          }
          return g;
      })
    })),
    on(GroupsActions.addStudents, (state, {group, students}) => ({
        ...state,
        groups: state.groups.map(g => {
            if (g.id === group.id) {
                const grp = new Group({...g, students: [...g.students]});
                students.forEach(student => {
                    if (!g.students.some(s => s.id === student.id)) {
                        grp.students.push(student);
                    }
                });
                return grp;
            }
            return g;
        })
      })),
    on(GroupsActions.removeStudent, (state, {student}) => ({
        ...state,
        groups: state.groups.map(g => {
                return new Group({...g, students: g.students.filter(s => s.id !== student.id)});
        })
    })),
);
