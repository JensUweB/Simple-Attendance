import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsListComponent } from './pages/students-list/students-list.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [StudentsListComponent],
  imports: [
    // Core
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,

    // Intern
    StudentsRoutingModule,

    // Extern
  ],
  exports: [StudentsListComponent],
})
export class StudentsModule {}
