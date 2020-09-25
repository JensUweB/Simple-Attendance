import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingRoutingModule } from './training-routing.module';
import {NewTrainingComponent} from './pages/new-training/new-training.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TrainingArchiveComponent} from './pages/training-archive/training-archive.component';


@NgModule({
  declarations: [
      NewTrainingComponent,
      TrainingArchiveComponent,
  ],
    imports: [
        CommonModule,
        TrainingRoutingModule,
        IonicModule,
        FormsModule,

    ],
  exports: [
      NewTrainingComponent,
      TrainingArchiveComponent
  ],
    providers: []
})
export class TrainingModule { }
