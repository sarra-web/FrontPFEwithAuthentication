import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardAdminRoutingModule } from './board-admin-routing.module';
import { ProjectComponent } from './projects/project/project.component';
import { UserDetailsComponent } from './user-management/user-details/user-details.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserDetailsComponent
  ],
  imports: [
    CommonModule,
    BoardAdminRoutingModule,
    FormsModule
  ]
})
export class BoardAdminModule { }
