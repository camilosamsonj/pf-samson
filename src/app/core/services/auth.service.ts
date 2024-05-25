import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { BehaviorSubject, Observable, delay, of } from 'rxjs';
import swal from 'sweetalert2'
import { FormGroup } from '@angular/forms';
import { IUser } from '../../layouts/dashboard/pages/users/models';
import { ILoginData } from '../../layouts/auth/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private MOCK_AUTH_USER : IUser = {
    id: 1,
    createdAt: new Date(),
    email: 'email@mail.com',
    firstName: 'Camilo',
    lastName: 'Samson',
    role: 'ADMIN'
  };

  private _authUser$ = new BehaviorSubject<IUser | null>(null);
  public authUser$ = this._authUser$.asObservable();

  constructor(private router: Router) { }

  login(loginData: ILoginData, authUserForm: FormGroup): Observable<boolean> {
    if(loginData.email ==='camilosamson@outlook.com' && loginData.password === '246810') {
      this._authUser$.next(this.MOCK_AUTH_USER);
      localStorage.setItem('accessToken',
      'abcdefghijklmnñopqrstuvwxyz');
      this.router.navigate(['dashboard', 'home']);
      return of(true).pipe(delay(500));   
    } else if (authUserForm.invalid) {
      swal.fire({
        title: 'Formulario Invalido',
        icon: 'warning',
        text: 'Por favor complete los campos requeridos'
      });
      return of(false).pipe(delay(500));
    } else {
      swal.fire({
        title: 'Correo o password incorrectos',
        icon: 'warning',
        text: 'Por favor intente nuevamente',
      });
      return of(false).pipe(delay(500));

    }
    }
  

  verifyToken(): boolean {
    const token = sessionStorage.getItem('accessToken');
    if(token) {
      this._authUser$.next(this.MOCK_AUTH_USER);
      return true;
    } else {
      return false;
    }
  
  }


  logout(): void {
    

    this._authUser$.next(null); 
    sessionStorage.removeItem('accessToken');
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.onmouseenter = swal.stopTimer;
        toast.onmouseleave = swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: 'info',
      title: '¡Hasta pronto!'
    });
    this.router.navigate(['auth']);
    
  }

}
