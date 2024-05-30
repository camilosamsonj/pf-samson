import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UsersActions } from './users.actions';
import { UsersService } from '../users.service';


@Injectable()
export class UsersEffects {

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(UsersActions.loadUsers),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
       this.usersService.getUsers().pipe(
          map(data => UsersActions.loadUsersSuccess({ data })),
          catchError(error => of(UsersActions.loadUsersFailure({ error }))))
      )
    );
  });


  constructor(private actions$: Actions,
    private usersService: UsersService
  ) {}
}
