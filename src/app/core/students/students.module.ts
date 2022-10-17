import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StudentsRoutingModule } from "./students-routing.module";
import { StudentsListComponent } from "./pages/students-list/students-list.component";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [StudentsListComponent],
  imports: [
    // Core
    CommonModule,
    IonicModule,
    SharedModule,

    // Intern
    StudentsRoutingModule,

    // Extern
  ],
  exports: [StudentsListComponent],
})
export class StudentsModule {}
