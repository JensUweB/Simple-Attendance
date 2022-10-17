import { createAction, props } from '@ngrx/store';
import { Training } from 'src/app/core/classes/training.class';

export const addTraining = createAction('[Trainings] Add Training', props<{ training: Training }>());

export const removeTraining = createAction('[Trainings] Remove Training', props<{ training: Training }>());

export const selectTraining = createAction('[Trainings] Select Training', props<{ training: Training }>());
