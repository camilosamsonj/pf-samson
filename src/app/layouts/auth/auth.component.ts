import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService  } from './../../core/services/auth.service';
import swal from 'sweetalert2'
import { ILoginData } from './models';
import { Store } from '@ngrx/store';
import { authActions } from '../../store/auth/auth.actions';
import { authUser } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {

  loginData: ILoginData = {
    email: '',
    password: ''
  };

  authUserChangeSubscription?: Subscription;
  authUserForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private store: Store
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
    this.store.select(authUser).subscribe({
      next: (user) => {
        if(user)  this.router.navigate(['dashboard', 'home']);
      }
    })
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
    if(this.authUserForm.invalid){
      swal.fire({
        title: 'Formulario Invalido',
        icon: 'warning',
        text: 'Por favor complete los campos requeridos'
      });
    } else {
      this.store.dispatch(authActions.login({payload: this.authUserForm.getRawValue()}));
      const Toast = swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = swal.stopTimer;
          toast.onmouseleave = swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso'
      });
    }
  } 



  logout(): void {
    this.store.dispatch(authActions.logout());
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

  
    onKeyDown(event: KeyboardEvent){
      if (event.key === 'Enter') {
        this.login();
        
      }
    }

  }

