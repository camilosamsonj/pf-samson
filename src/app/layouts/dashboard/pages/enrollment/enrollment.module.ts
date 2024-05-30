import { NgModule } from '@angular/core';
import { EnrollmentComponent } from './enrollment.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EnrollmentRoutingModule } from './enrollment-routing.module';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [
    EnrollmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EnrollmentRoutingModule,
  ]
})
export class EnrollmentModule { }
