import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import {NewAttendanceComponent} from './pages/new-attendance/new-attendance.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {AttendanceArchiveComponent} from './pages/attendance-archive/attendance-archive.component';
import {PrintViewComponent} from './components/print-view/print-view.component';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {GroupModule} from '../groups/group.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
      NewAttendanceComponent,
      AttendanceArchiveComponent,
      PrintViewComponent
  ],
    imports: [
        CommonModule,
        AttendanceRoutingModule,
        IonicModule,
        FormsModule,
        GroupModule,
        TranslateModule,
    ],
  exports: [
      NewAttendanceComponent,
      AttendanceArchiveComponent,
      PrintViewComponent
  ],
    providers: [
        File,
        SocialSharing,
        AndroidPermissions,
    ]
})
export class AttendanceModule { }
