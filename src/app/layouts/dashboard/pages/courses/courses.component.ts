import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICourse } from './models';
import { CoursesService } from './courses.service';
import { MatDialog } from '@angular/material/dialog';
import { CoursesDialogComponent} from '../courses/components/courses-dialog/courses-dialog.component'
import swal from 'sweetalert2';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { StudentsService } from '../students/students.service';
import { Store } from '@ngrx/store';
import { selectCoursesError, selectCoursesList, selectLoadingCourses } from './store/courses.selectors';
import { Observable, map } from 'rxjs';
import { CoursesActions } from './store/courses.actions';
import { SweetAlertService } from '../../../../core/services/sweet-alert.service';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
})
export class CoursesComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'startDate',
    'durationMonths',
    'instructor',
    'actions',
  ];

  loadingCourses$: Observable<boolean>;

  studentId: string = '';
  courseId: string = '';
  error$: Observable<unknown>;
  courses$: Observable<ICourse[]>;

  constructor(
    private coursesService: CoursesService,
    private matDialog: MatDialog,
    private breakinpointObserver: BreakpointObserver,
    private store: Store,
    private sweetAlertService: SweetAlertService,
  ) {
    this.breakinpointObserver.observe([Breakpoints.Handset]).subscribe((r) => {
      if (r.matches) {
        this.displayedColumns = ['name', 'instructor', 'actions'];
      } else {
        this.displayedColumns = [
          'id',
          'name',
          'startDate',
          'durationMonths',
          'instructor',
          'actions',
        ];
      }
    });
    this.error$ = this.store.select(selectCoursesError);
    this.courses$ = this.store.select(selectCoursesList);
    this.loadingCourses$ = this.store.select(selectLoadingCourses);
    
  }

  ngOnInit(): void {
  this.loadCourses();
  }

  loadCourses(): void {
    this.store.dispatch(CoursesActions.loadCourses());
  }


  openDialog(editingCourse?: ICourse): void {
    this.matDialog
      .open(CoursesDialogComponent, { data: editingCourse })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result) {
            if (editingCourse) {
              const updatedCourse: ICourse = { ...editingCourse, ...
                result };
              this.coursesService.updateCourse(updatedCourse).subscribe({
                next: () => {
                  this.courses$ = this.courses$.pipe(map(courses => courses.map((c) => c.id === editingCourse.id ? {...c, ...result}: c)));
                },
                error: (error) => {
                  this.sweetAlertService.showCustomAlert('Error', `Ocurrió un error al intentar editar el curso ${error}`, 'error');
                },
                complete: () => {
                  this.sweetAlertService.showCustomAlert('¡Cambios aplicados!', 'El curso se ha editado correctamente', 'success');
                },
              });
            } else {
              this.coursesService.createCourse(result).subscribe({
                next: (createdCourse) => {
                  this.courses$ = this.courses$.pipe(map((courses: ICourse[]) => ([...courses, createdCourse])));
                },
                error: (error) => {
                  
                  swal.fire({
                    title: 'Error',
                    text: `Ocurrió un error al intentar agregar un curso: ${error}`,
                    icon: 'info',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                  });
                  console.log('Error al crear el curso: ', error);
                },
                complete: () => {
                  swal.fire({
                    title: 'Curso Guardado!',
                    text: '¡El curso se ha agregado correctamente!',
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                  });
                },
              });
            }
          }
        },
      });
  }

  onDeleteCourse(id: number): void {
    swal .fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
            this.coursesService.deleteCourse(id).subscribe({
              next: () => {

                this.courses$ = this.courses$.pipe(map(courses => courses.filter(course => course.id !== id)));
              },
              error: (error) => {
                swal.fire({
                  title: 'Error',
                  text: `Ocurrió un error al intentar eliminar el curso: ${error}`,
                  icon: 'info',
                  timer: 1000,
                  timerProgressBar: true,
                  showConfirmButton: false,
                });
                console.log('Error al intentar el curso: ', id);
              },
              complete: () => {
                swal.fire({
                  title: '¡Eliminado!',
                  text: 'El curso ha sido eliminado.',
                  icon: 'success',
                  timer: 1000,
                  timerProgressBar: true,
                  showConfirmButton: false,
                });
              },
            });
          
        } else if (result.dismiss) {
          swal.fire({
            title: 'Cancelado',
            text: 'Ningún curso fue eliminado',
            icon: 'info',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      });
  }




}
