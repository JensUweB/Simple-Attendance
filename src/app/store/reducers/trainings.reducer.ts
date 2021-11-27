import {createReducer, on} from '@ngrx/store';
import { Training } from 'src/app/core/classes/training.class';
import { TrainingsActions } from '../actions';

export interface TrainingsState {
  trainings: Training[];
}

export const initialState: TrainingsState = {
    trainings: [],
};

export const trainingsReducer = createReducer(
    initialState,
    on(TrainingsActions.addTraining, (state, {training}) => ({...state, trainings: state.trainings.concat(training)})),
    on(TrainingsActions.removeTraining, (state, {training}) => ({...state, trainings: state.trainings.filter(t => t.id !== training.id)})),
);
