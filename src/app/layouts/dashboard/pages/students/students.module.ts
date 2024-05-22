import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { StudentsComponent } from './students.component';
import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';
import {StudentsRoutingModule} from './students-routing.module';
import { StudentDetailComponent } from './pages/student-detail/student-detail.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ StudentsComponent,  StudentDetailComponent, StudentDialogComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    StudentsRoutingModule,
  ],
  exports: [StudentsComponent],
})
export class StudentsModule { }