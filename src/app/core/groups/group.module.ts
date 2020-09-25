import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GroupRoutingModule} from './group-routing.module';
import {GroupListComponent} from './pages/group-list/group-list.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {GroupService} from './services/group.service';
import {GroupDetailsComponent} from './pages/group-details/group-details.component';



@NgModule({
  declarations: [
      GroupListComponent,
      GroupDetailsComponent
  ],
    imports: [
        CommonModule,
        IonicModule,
        GroupRoutingModule,
        FormsModule
    ],
    exports: [
        GroupListComponent,
        GroupDetailsComponent
    ],
    providers: [
        GroupService
    ]
})
export class GroupModule { }
