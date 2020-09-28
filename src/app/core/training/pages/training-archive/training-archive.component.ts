import { Component, OnInit} from '@angular/core';
import {Training, TrainingService} from '../../services/training.service';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-training-archive',
  templateUrl: './training-archive.component.html',
  styleUrls: ['./training-archive.component.scss'],
})
export class TrainingArchiveComponent implements OnInit {
  public trainings: Training[] = [];
  public printView = false;

  constructor(private trainingService: TrainingService, private alertCtrl: AlertController) {
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

  async removeTraining(training: Training) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm delete',
      message: 'Do you really want to delete this archive entry? This cannot be undone!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Confirm',
          handler: () => {
            this.trainings = this.trainings.filter(item => item.datetime !== training.datetime);
            this.trainingService.removeTraining(training);
          }
        }
      ]
    });
    await alert.present();
  }

  countStatus(training: Training, status: number) {
    let count = 0;
    training.students.forEach((student) => {
      if (student.status === status) { count ++; }
    });
    return count;
  }
}
