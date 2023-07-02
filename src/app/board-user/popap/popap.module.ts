import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PopapRoutingModule } from './popap-routing.module';
import { PopupComponent } from './popap/popup/popup.component';


@NgModule({
  declarations: [
    PopupComponent,
  ],
  imports: [
    CommonModule,
    PopapRoutingModule,FormsModule,
  ]
})
export class PopapModule { }
