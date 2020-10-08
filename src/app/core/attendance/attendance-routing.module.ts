import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewAttendanceComponent} from './pages/new-attendance/new-attendance.component';
import {AttendanceArchiveComponent} from './pages/attendance-archive/attendance-archive.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'new'
  },
  {
    path: 'new',
    component: NewAttendanceComponent
  },
  {
    path: 'archive',
    component: AttendanceArchiveComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
