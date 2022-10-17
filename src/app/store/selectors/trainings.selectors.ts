import { createSelector } from "@ngrx/store";
import { Training } from "src/app/core/classes/training.class";
import { TrainingsState, State } from "../reducers";

export const select = (state: State) => state.trainings;

export const trainings = createSelector<State, TrainingsState, Training[]>(
  select,
  (state: TrainingsState) => state.trainings
);

export const selectedTraining = createSelector<State, TrainingsState, Training>(
  select,
  (state: TrainingsState) => state.selectedTraining
);
