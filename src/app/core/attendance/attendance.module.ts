import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { NewAttendanceComponent } from './pages/new-attendance/new-attendance.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AttendanceArchiveComponent } from './pages/attendance-archive/attendance-archive.component';
import { PrintViewComponent } from './components/print-view/print-view.component';
import { GroupModule } from '../groups/group.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NewAttendanceComponent, AttendanceArchiveComponent, PrintViewComponent],
  imports: [CommonModule, AttendanceRoutingModule, IonicModule, FormsModule, GroupModule, SharedModule],
  exports: [NewAttendanceComponent, AttendanceArchiveComponent, PrintViewComponent],
  providers: [],
})
export class AttendanceModule {}
