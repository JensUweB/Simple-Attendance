import { StudentsState } from './students.reducer';
import { GroupsState } from './groups.reducer';
import { TrainingsState } from './trainings.reducer';
import * as fromStudents from './students.reducer';
import * as fromGroups from './groups.reducer';
import * as fromTrainings from './trainings.reducer';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

export interface State {
  students: fromStudents.StudentsState;
  groups: fromGroups.GroupsState;
  trainings: fromTrainings.TrainingsState;
}

export const reducers: ActionReducerMap<State> = {
  students: fromStudents.studentsReducer,
  groups: fromGroups.groupsReducer,
  trainings: fromTrainings.trainingsReducer,
};

const localStorageSyncReducer = (reducer: ActionReducer<State>) =>
  localStorageSync({
    keys: [{ students: ['students'] }, { groups: ['groups'] }, { trainings: ['trainings'] }],
    rehydrate: true,
  })(reducer);

export const metaReducers: Array<MetaReducer<any, any>> = [];

// check if in SSR!
if (typeof window !== 'undefined') {
  metaReducers.push(localStorageSyncReducer);
}

export { StudentsState, GroupsState, TrainingsState };
