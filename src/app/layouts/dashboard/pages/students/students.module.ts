import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { StudentsComponent } from './students.component';
import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';
import {StudentsRoutingModule} from './students-routing.module';
import { StudentDetailComponent } from './pages/student-detail/student-detail.component';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StudentEffects } from './store/student.effects';
import { StoreModule } from '@ngrx/store';
import {studentFeature} from './store/student.reducer'

@NgModule({
  declarations: [ StudentsComponent,  StudentDetailComponent, StudentDialogComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    StudentsRoutingModule,
    StoreModule.forFeature(studentFeature),
    EffectsModule.forFeature([StudentEffects]),
  ],
  exports: [StudentsComponent],
})
export class StudentsModule { }