import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardAdminRoutingModule } from './board-admin-routing.module';
import { ProjectComponent } from './projects/project/project.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BoardAdminRoutingModule
  ]
})
export class BoardAdminModule { }
