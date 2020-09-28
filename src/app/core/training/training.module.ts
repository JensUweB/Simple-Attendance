import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingRoutingModule } from './training-routing.module';
import {NewTrainingComponent} from './pages/new-training/new-training.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TrainingArchiveComponent} from './pages/training-archive/training-archive.component';
import {PrintViewComponent} from './components/print-view/print-view.component';


@NgModule({
  declarations: [
      NewTrainingComponent,
      TrainingArchiveComponent,
      PrintViewComponent
  ],
    imports: [
        CommonModule,
        TrainingRoutingModule,
        IonicModule,
        FormsModule,

    ],
  exports: [
      NewTrainingComponent,
      TrainingArchiveComponent,
      PrintViewComponent
  ],
    providers: []
})
export class TrainingModule { }
