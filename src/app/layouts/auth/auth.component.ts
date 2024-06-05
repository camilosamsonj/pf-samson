import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, concatMap, map, tap } from 'rxjs';
import { AuthService } from './../../core/services/auth.service';
import { ILoginData } from './models';
import { Store } from '@ngrx/store';
import * as actions from '../../store/auth/auth.actions';
import { selectAuthUser } from '../../store/auth/auth.selectors';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from './register/register.component';
import { UsersService } from '../dashboard/pages/users/users.service';
import { SweetAlertService } from '../../core/services/sweet-alert.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  loginData: ILoginData = {
    email: '',
    password: '',
  };

  authUserChangeSubscription?: Subscription;
  authUserForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private store: Store,
    private matDialog: MatDialog,
    private usersService: UsersService,
    private sweetAlertService: SweetAlertService
  ) {
    this.authUserForm = this.fb.group({
      email: [
        '',
        [
          Validators.email,
          Validators.required,
          Validators.pattern(
            '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.store.select(selectAuthUser).subscribe({
      next: (user) => {
        if (user) this.router.navigate(['dashboard', 'home']);
      },
    });
  }
  ngOnDestroy(): void {
    this.authUserChangeSubscription?.unsubscribe();
  }
  get emailControl() {
    return this.authUserForm.get('email');
  }
  get passwordControl() {
    return this.authUserForm.get('password');
  }

  login(): void {
    if (this.authUserForm.invalid) {
      this.authUserForm.markAllAsTouched();
      this.sweetAlertService.showCustomAlert('Formulario Inválido', 'Por favor complete los campos requeridos', 'warning');
    } else {
      const userEmail = this.authUserForm.get('email')?.value;
      this.usersService.getUserByEmail(userEmail).subscribe({
        next: (payload) => {
          payload;
          this.store.dispatch(
            actions.login({payload: this.authUserForm.getRawValue()})
          )
        },
        error: (error) => {
          console.error('Error al iniciar sesión', error);
        },
        complete: () => {
          this.store.select(selectAuthUser).subscribe((user) => {
            const firstName = user?.firstName;
            const lastName = user?.lastName;
            this.sweetAlertService.showCustomToast(`Bienvenido ${firstName} ${lastName} `, 'success');
          }); 
          
        } 
      });
    }
  }

  openDialog(): void {
    this.matDialog
      .open(RegisterComponent)
      .afterClosed()
      .subscribe({
        next: (result) => {
          if(result) {
            this.usersService.createUser(result).subscribe({
              next: (userToCreate) => {
                const currentDate = new Date();
                userToCreate = {
                  ...userToCreate,
                  createdAt: currentDate,
                }
              },
              error: (error) => {
                this.sweetAlertService.showCustomAlert(
                  'Error',
                  `Error: ${error} al registrar el usuario`,
                  'error'
                );
              },
              complete: () => {
                this.sweetAlertService.showCustomAlert(
                  'Usuario creado',
                  'El usuario se ha registrado correctamente',
                  'success'
                );
              }
            })
          }
        }
      }
        
  )}

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.login();
    }
  }
}
