import { Component, Inject, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UsersService } from '../../dashboard/pages/users/users.service';
import { Router } from '@angular/router';
import { IUser } from '../../dashboard/pages/users/models';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})


export class RegisterComponent {
  isMobile(): boolean {
    return window.innerWidth < 768;
  }
  registerUserForm: FormGroup;
  

  

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private router: Router,
    private sweetAlertService: SweetAlertService,
    private matDialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUser
  ) {
    this.registerUserForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$'),
          Validators.minLength(2),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$'),
          Validators.minLength(2),
        ],
      ],
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
      role: [
        'USER',
        [Validators.required]
      ],
      password: [
        '', 
        [
          Validators.required, 
          Validators.minLength(6)
        ]
      ],
      confirmPassword: [
        '', 
        [Validators.required]
    ],
    });

    this.registerUserForm.get('confirmPassword')?.valueChanges.pipe(
      take(1)
    ).subscribe(() => {
      const confirmPasswordControl = this.registerUserForm.get('confirmPassword');
      if (confirmPasswordControl) {
        const passwordControl = this.registerUserForm.get('password');
        if(passwordControl){
          confirmPasswordControl.clearValidators();
          confirmPasswordControl.setValidators([Validators.required, this.equalsValidator(passwordControl)]);
          confirmPasswordControl.updateValueAndValidity();
        }
      }
    });
  }

  equalsValidator(matchingPasswordControl: AbstractControl): ValidatorFn {
  return (passwordControl: AbstractControl): { [key: string]: any} | null => {
    if(!matchingPasswordControl || !passwordControl){
      return null;
    }
    const passwordControlValue = passwordControl.value;
    const matchingPasswordControlValue = matchingPasswordControl.value;
    return passwordControlValue === matchingPasswordControlValue ? null : { 'notEquals' : { passwordControlValue, matchingPasswordControlValue}}   
  };
}




  get firstNameControl() {
    return this.registerUserForm.get('firstName');
  }
  get lastNameControl() {
    return this.registerUserForm.get('lastName');
  }
  get emailControl() {
    return this.registerUserForm.get('email');
  }
  get passwordControl() {
    return this.registerUserForm.get('password');
  }
  get confirmPasswordControl() {
    return this.registerUserForm.get('confirmPassword');
  }
  get roleControl(){
    return this.registerUserForm.get('role');
  }


  onSave(): void {
    if (this.registerUserForm.invalid) {
      this.registerUserForm.markAllAsTouched();
      this.sweetAlertService.showCustomAlert(
        'Formulario Inválido',
        'Debe completar el formulario o ingresar datos válidos',
        'warning'
      );
    } else {
      const createdUser: IUser = this.registerUserForm.value;
      this.usersService.getUsers().pipe(map((users) => {
        return users.map((user) => user.email);
      })).pipe(tap(usersEmails => {
        if(usersEmails.includes(createdUser.email)) {
          this.sweetAlertService.showCustomAlert(
            `Email ya registrado`,
            `La dirección ${createdUser.email} ya se encuentra en uso, intente con otra dirección de correo electrónico`,
            'warning'
          );
        } else {
          this.matDialogRef.close(createdUser);
        }
      })).subscribe();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSave();
    }
  }
}


