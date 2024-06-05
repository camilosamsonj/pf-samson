import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap, concatMap } from 'rxjs/operators';
import { AuthService } from './../../core/services/auth.service';
import * as actions from './auth.actions';
import { UsersService } from '../../layouts/dashboard/pages/users/users.service';
import { IUser } from '../../layouts/dashboard/pages/users/models';
import { Router } from '@angular/router';



@Injectable()
export class AuthEffects {

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.login),
      switchMap(({ payload }) =>
        this.authService.login(payload).pipe(
          switchMap((user) => {
            if (this.isUser(user)) {
              return this.userService.getUserByEmail(user.email).pipe(
                map((data) => {
                  if(data) { 
                    return actions.loginSuccess({data})                    
                  } else {
                    return actions.loginFailure({error: `El usuario no se encuentra registrado`})
                  }
                }),
                catchError((error) => of(actions.loginFailure({ error })))
              );
            } else {
              return of(actions.loginFailure({ error: '' }));
            }
          }),
          catchError((error) => of(actions.loginFailure({ error })))
        )
      )
    );
  });


  logout$ = createEffect(() => 
    this.actions$.pipe(
      ofType(actions.logout), 
      switchMap(() => 
        of(this.authService.logout()).pipe(
          map(() => {
            localStorage.removeItem('accessToken');
            this.router.navigate(['auth']);
            return actions.logoutSuccess({mssg: 'Ha cerrado sesión'})
          }),
          catchError(error => of(actions.logoutFailure({error})))
        )      
      )
    )
  );

  private isUser(user: any): user is IUser {
    return typeof user === 'object' && user !== null && 'email' in user;
  }

  constructor(
    private actions$: Actions,
    private userService: UsersService,
    private router: Router,
    private authService: AuthService,
  ) {}
}
