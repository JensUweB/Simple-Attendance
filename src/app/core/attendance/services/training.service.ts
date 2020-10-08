import { Injectable } from '@angular/core';
import {Student} from '../../students/services/student.service';
import {Group} from '../../groups/services/group.service';

export interface Training {
  id: string;
  students: {
    student: Student,
    status: number
  }[];
  group: {
    id: string,
    name: string
  };
  datetime: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private trainings: Training[];

  constructor() {
    this.load();
  }

  /**
   * Adds a new attendance object to the array
   * @param training the object to add
   */
  addTraining(training: Training) {
    if (!this.trainings.some(item => item.id === training.id)) {
      this.trainings.push(training);
      this.save();
      this.load();
    } else {
      this.trainings.forEach(item => {
        if (item.datetime === training.datetime) {
          item = training;
        }
      });
    }
  }

  /**
   * Removes an existing attendance object from the array
   * @param training the object to remove
   */
  removeTraining(training: Training) {
    this.trainings = this.trainings.filter(item => item.id !== training.id);
    this.save();
  }

  /**
   * Returns an array of trainings
   */
  getTrainings() {
    return [...this.trainings];
  }

  /**
   * Saves the trainings to local storage
   */
  save() {
    localStorage.setItem('trainings', JSON.stringify(this.trainings));
  }

  /**
   * Loads the trainings from local storage
   */
  load() {
    this.trainings = JSON.parse(localStorage.getItem('trainings'));
    if (!this.trainings) {
      this.trainings = [];
    } else {
      // Sort attendance entries by date
      this.trainings.sort((a, b) => {
        if (a.datetime > b.datetime) {
          return -1;
        } else if (a.datetime === b.datetime) {
          return 0;
        } else {
          return 1;
        }
      });
    }
  }
}
