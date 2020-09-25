import { Component, OnInit} from '@angular/core';
import {Training, TrainingService} from '../../services/training.service';

@Component({
  selector: 'app-training-archive',
  templateUrl: './training-archive.component.html',
  styleUrls: ['./training-archive.component.scss'],
})
export class TrainingArchiveComponent implements OnInit {
  public trainings: Training[] = [];

  constructor(private trainingService: TrainingService) {
    this.trainings = this.trainingService.getTrainings();
  }

  ngOnInit() {}



  toggleList(id: string) {
    const eleContent = document.getElementById('content-' + id);
    const eleCard = document.getElementById('card-' + id);
    if (eleContent.classList.contains('ion-hide')) {
      eleContent.classList.remove('ion-hide');
    } else {
      eleContent.classList.add('ion-hide');
    }
  }

  removeTraining(training: Training) {
    this.trainings = this.trainings.filter(item => item.datetime !== training.datetime);
    this.trainingService.removeTraining(training);
  }

  countStatus(training: Training, status: number) {
    let count = 0;
    training.students.forEach((student) => {
      if (student.status === status) { count ++; }
    });
    return count;
  }
}
