import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PadEndPipe } from './pipes/pad-end.pipe';
import { PadStartPipe } from './pipes/pad-start.pipe';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [PadStartPipe, PadEndPipe],
  exports: [PadStartPipe, PadEndPipe],
  imports: [CommonModule, IonicModule],
  providers: [],
})
export class SharedModule {}
