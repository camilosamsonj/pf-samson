import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IStudent} from '../../models';
import {SweetAlertService} from '../../../../../../core/services/sweet-alert.service';

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
})
export class StudentDialogComponent {

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  studentForm: FormGroup;
  years: number[] = [
    2010, 
    2011, 
    2012, 
    2013, 
    2014, 
    2015, 
    2016, 
    2017, 
    2018, 
    2019, 
    2020, 
    2021,
    2022,
    2023,
    2024
  ];

  constructor (
    private sweetAlertService: SweetAlertService,
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editingStudent?: IStudent
  ) {
    this.studentForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$'),
          Validators.minLength(2),
        ]
      ],
      lastName: [
        '', 
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$'),
          Validators.minLength(2),
        ]
      ],
      email: [
        '', 
        [
          Validators.email,
          Validators.required,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'),
        ]
      ],
      anoIngreso: [
        '',
        [
          Validators.required,
        ]
      ]
    });

    if(editingStudent) {
      this.studentForm.patchValue(editingStudent);
    }
  }

  get firstNameControl(){
    return this.studentForm.get('firstName');
  }
  get lastNameControl(){
    return this.studentForm.get('lastName');
  }
  get emailControl(){
    return this.studentForm.get('email');
  }
  get anoIngresoControl(){
    return this.studentForm.get('anoIngreso');
  }

  onSave(): void {
    if(this.studentForm.invalid){
      this.studentForm.markAllAsTouched();
      this.sweetAlertService.showCustomAlert('Formulario Invalido', 'Debe completar el formulario o ingresar datos válidos', 'warning');
    } else {
      const updatedStudent: IStudent = this.studentForm.value;

    if (this.editingStudent) {

      updatedStudent.id = this.editingStudent.id; 
    }
      this.matDialogRef.close(updatedStudent);    
  }
}
}

