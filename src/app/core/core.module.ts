import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GroupModule} from './groups/group.module';
import {StudentsModule} from './students/students.module';
import {AttendanceModule} from './attendance/attendance.module';



@NgModule({
  declarations: [
  ],
  imports: [
      CommonModule,
      GroupModule,
      StudentsModule,
      AttendanceModule
  ],
  exports: [

  ],
})
export class CoreModule { }
