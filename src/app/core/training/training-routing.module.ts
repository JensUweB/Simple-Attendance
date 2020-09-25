import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StudentsListComponent} from '../students/pages/students-list/students-list.component';
import {NewTrainingComponent} from './pages/new-training/new-training.component';
import {TrainingArchiveComponent} from './pages/training-archive/training-archive.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'new'
  },
  {
    path: 'new',
    component: NewTrainingComponent
  },
  {
    path: 'archive',
    component: TrainingArchiveComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
