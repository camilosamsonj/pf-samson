import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { StudentActions } from './student.actions';
import { StudentsService } from '../../students/students.service';


@Injectable()
export class StudentEffects {

  loadStudents$ = createEffect(() => {
    return this.actions$.pipe(

      // filtrar todas las acciones que se disparan en mi app
      // y toma las acciones que indicamos
      ofType(StudentActions.loadStudents),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        this.studentService.getStudents().pipe(
          // success :
          map(data => StudentActions.loadStudentsSuccess({ data })),      
          //error:
         catchError(error => of(StudentActions.loadStudentsFailure({ error }))))
      )
    );
  });


  constructor(private actions$: Actions,
    private studentService: StudentsService
  ) {}
}
