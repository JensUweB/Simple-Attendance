import {createSelector} from '@ngrx/store';
import { Group } from 'src/app/core/classes/group.class';
import {GroupsState, State} from '../reducers';

export const select = (state: State) => state.groups;

export const groups = createSelector<State, GroupsState, Group[]>(
  select,
  (state: GroupsState) => state.groups
);
