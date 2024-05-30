import { Component, OnDestroy, OnInit } from '@angular/core';
import { IStudent } from './models';
import { MatDialog } from '@angular/material/dialog';
import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';
import { Store } from '@ngrx/store';
import { selectErrorStudents, selectLoadingStudents, selectStudentsList} from './store/student.selectors';
import { StudentActions } from './store/student.actions';
import { Observable, map } from 'rxjs';
import { SweetAlertService} from '../../../../core/services/sweet-alert.service'


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
})
export class StudentsComponent implements OnInit{
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'anoIngreso',
    'actions',
  ];

  loadingStudents$: Observable<boolean>;
  error$: Observable<unknown>;
  students$: Observable<IStudent[]>;



  constructor(
    private matDialog: MatDialog,
    private breakingpointObsver: BreakpointObserver,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private store: Store,
    private sweetAlertService: SweetAlertService,
  ) {
    this.breakingpointObsver.observe([Breakpoints.Handset]).subscribe((res) => {
      if (res.matches) {
        this.displayedColumns = ['id', 'firstName', 'actions'];
      } else {
        this.displayedColumns = [
          'id',
          'firstName',
          'lastName',
          'email',
          'anoIngreso',
          'actions',
        ];
      }
    });
    this.loadingStudents$ = this.store.select(selectLoadingStudents);
    this.error$ = this.store.select(selectErrorStudents);
    this.students$ = this.store.select(selectStudentsList);
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }

  loadStudents(): void {

    this.store.dispatch(StudentActions.loadStudents());

  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe();
  }

  openDialog(editingStudent?: IStudent): void {

    this.matDialog
      .open(StudentDialogComponent, {
        data: editingStudent,
        
      })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result) {
            if (editingStudent) {
                const updatedStudent: IStudent = {...editingStudent, ...result};
                this.studentsService.updateStudent(updatedStudent).subscribe({
                  next: () => {
                    this.students$ = this.students$.pipe(map(students => students.
                      map(s => s.id
                       === editingStudent.id ? {...s, ...result} : s))
                    );
                  },
                  error: (error) => {
                    console.error('Error al actualizar al estudiante: ', error);
                    console.log(editingStudent);
                  },
                  complete: () => {
                    this.sweetAlertService.showCustomAlert('¡Cambios Aplicados!', '¡El alumno se ha editado correctamente!', 'success');
                  }
                });             
            } else {
              this.studentsService.createStudent(result).subscribe({
                next: (createdStudent: IStudent) => {
                  this.students$ = this.students$.pipe(map((students: IStudent[])=> ([...students, createdStudent])))
                },
              });
              this.sweetAlertService.showCustomAlert('Alumno Guardado','¡El alumno se ha agregado correctamente!', 'success');
            }
          }
        },
      });
  }

  onDeleteStudent(id: number): void {
    
    this.sweetAlertService.showConfirmation('¿Estás seguro?', 'No podrás revertir esta acción')
    .then((result)=> {
      if(result) {
        this.studentsService.deleteStudent(id).subscribe({
          next: () => {
            
            this.students$ = this.students$.pipe(map(students => students.filter(student => student.id !== id)));
            
          },
          error: () => {
            this.sweetAlertService.showCustomAlert('Error','¡Ocurrió un error al eliminar el alumno', 'error');
          },
          complete: () => {
            this.sweetAlertService.showCustomAlert('Alumno Eliminado','¡El alumno se ha eliminado correctamente!', 'success');
          }
      });
    } else {
      this.sweetAlertService.showCustomAlert('Operación cancelada','Ningún alumno fue eliminado', 'info');
      }
     });
  }


  
}

