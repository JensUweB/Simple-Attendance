import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PadEndPipe } from './pipes/pad-end.pipe';
import { PadStartPipe } from './pipes/pad-start.pipe';
import { File } from '@ionic-native/file/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [PadStartPipe, PadEndPipe],
  exports: [PadStartPipe, PadEndPipe],
  imports: [CommonModule, IonicModule],
  providers: [File, AndroidPermissions],
})
export class SharedModule {}
