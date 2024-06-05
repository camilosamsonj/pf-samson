import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { BehaviorSubject, Observable, delay, of, switchMap } from 'rxjs';
import { IUser } from '../../layouts/dashboard/pages/users/models';
import { ILoginData } from '../../layouts/auth/models';
import { UsersService } from '../../layouts/dashboard/pages/users/users.service';
import { SweetAlertService} from '../../core/services/sweet-alert.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authUser$ = new BehaviorSubject<IUser | null>(null);
  public authUser$ = this._authUser$.asObservable();

  constructor(private router: Router,
    private userService: UsersService,
    private sweetAlertService: SweetAlertService,
  ) {
    this.verifyToken();
  }

  get currentUser(): IUser | null {
    return this._authUser$.getValue();
  }

  getCurrentUser(): IUser | null {
    return this._authUser$.getValue();
  }

  login(loginData: ILoginData): Observable<IUser> {
    return this.userService.getUserByEmail(loginData.email).pipe(
      switchMap(user => {
        if(user && user.password === loginData.password) {
          this._authUser$.next(user);
          this.router.navigate(['dashboard', 'home']);
            return of(user); 
        } else {
          console.error(user);
          this.sweetAlertService.showCustomAlert('Correo o contraseña incorrectos', 'Por favor intente nuevamente', 'warning');
          return of(null as unknown as IUser);
        } 
      })
    )   
  }
  
  logout() {
    return this._authUser$.next(null)
  }


  verifyToken(): boolean {
    const token = sessionStorage.getItem('accessToken');
    if(token) {
      this._authUser$.next(this.currentUser);
      return true;
    } else {
      return false;
    }
  }


}
