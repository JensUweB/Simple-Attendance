import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GroupModule} from './groups/group.module';
import {StudentsModule} from './students/students.module';
import {TrainingModule} from './training/training.module';



@NgModule({
  declarations: [
  ],
  imports: [
      CommonModule,
      GroupModule,
      StudentsModule,
      TrainingModule
  ],
  exports: [

  ],
})
export class CoreModule { }
