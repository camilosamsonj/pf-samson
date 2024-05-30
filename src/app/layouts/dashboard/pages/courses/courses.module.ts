import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module'; 
import { CoursesComponent } from './courses.component';
import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesDialogComponent } from './components/courses-dialog/courses-dialog.component';
import { CoursesDetailComponent } from './pages/courses-detail/courses-detail.component';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { CoursesEffects } from './store/courses.effects';
import { StoreModule } from '@ngrx/store';
import { coursesFeature } from './store/courses.reducer';


@NgModule({
  declarations: [CoursesComponent, CoursesDialogComponent, CoursesDetailComponent],
  imports: [

    CommonModule,
    SharedModule,
    CoursesRoutingModule,
    StoreModule.forFeature(coursesFeature),
    EffectsModule.forFeature([CoursesEffects]),



  ],
  exports: [
    CoursesComponent,
  ]
})
export class CoursesModule { }

