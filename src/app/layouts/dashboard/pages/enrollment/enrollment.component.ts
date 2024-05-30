import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';
import { EnrollmentService } from './enrollment.service';
import swal from 'sweetalert2';
import { IStudent } from '../students/models';
import { ICourse } from '../courses/models';
import {
  EMPTY,
  Observable,
  catchError,
  concatMap,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { SweetAlertService } from '../../../../core/services/sweet-alert.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
})
export class EnrollmentComponent implements OnInit {
  students: IStudent[] = [];
  courses: ICourse[] = [];
  studentId: string = '';
  courseId: string = '';
  unenrollStudentId: string = '';
  unenrollCourseId: string = '';
  loading: boolean = false;

  constructor(
    private enrollmentService: EnrollmentService,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentsService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
      },
    });
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
    });
  }

  enrollStudent(): void {
    const student$: Observable<IStudent> = this.studentsService.getStudentById(
      this.studentId
    );

    student$
      .pipe(
        switchMap((student: IStudent) => {
          const { courses, ...modifiedStudent } = student;
          return this.coursesService.getCourseById(this.courseId).pipe(
            tap((course: ICourse) => {
              const selectedCourse: ICourse = course;
              const studentIds: string[] = (selectedCourse.students || []).map(
                (student) => student.id.toString()
              );
              if (studentIds?.includes(this.studentId)) {
                this.sweetAlertService.showCustomAlert(
                  'Error',
                  `El estudiante: ${student.firstName} ${student.lastName} ya se encuentra inscrito en el curso: ${course.name}`,
                  'error'
                );
              } else {
                this.enrollmentService
                  .enrollStudentInCourse(this.studentId, selectedCourse)
                  .subscribe({
                    next: (enrollmentResponse) => {
                      enrollmentResponse;
                      this.enrollmentService
                        .addStudentsToCourse(this.courseId, modifiedStudent)
                        .subscribe({
                          next: (addStudentsResponse) => {
                            addStudentsResponse;
                            this.sweetAlertService.showCustomAlert(
                              'Inscripción exitosa',
                              `El estudiante: ${student.firstName} ${student.lastName} fue inscrito correctamente en el curso: ${course.name}`,
                              'success'
                            );
                          },
                          error: (error) => {
                            throw new Error(
                              `Error al agregar estudiantes al curso: ${error}`
                            );
                          },
                        });
                    },
                    error: (error) => {
                      throw new Error(
                        `Error al inscribir al estudiante en el curso: ${error}`
                      );
                    },
                  });
              }
            })
          );
        })
      )
      .subscribe({
        error: (error) => {
          swal.fire({
            title: 'Error',
            text: `Error al realizar la inscripción: ${error}`,
            icon: 'error',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        },
      });
  }

  unenrollStudent(): void {
    const student$: Observable<IStudent> = this.studentsService.getStudentById(
      this.unenrollStudentId
    );

    student$
      .pipe(
        switchMap((student: IStudent) => {
          return this.coursesService.getCourseById(this.unenrollCourseId).pipe(
            concatMap((course: ICourse) => {
              const courseIdsInStudents: string[] = (student.courses || []).map(
                (course) => course.id.toString()
              );
              if (courseIdsInStudents?.includes(this.unenrollCourseId)) {
                return this.enrollmentService
                  .unenrollStudentFromCourse(
                    this.unenrollStudentId,
                    this.unenrollCourseId,
                    student
                  )
                  .pipe(
                    tap((value: ICourse | null) => {
                      if (value !== null) {
                        this.sweetAlertService.showCustomAlert(
                          'Desinscripción Exitosa',
                          `El estudiante ${student.firstName} ${student.lastName} fue desinscrito correctamente del curso: ${course.name}`,
                          'success'
                        );
                      }
                    }),
                    concatMap(() => {
                      return this.enrollmentService.updateCourseAfterStudentRemoval(
                        this.unenrollCourseId,
                        this.unenrollStudentId
                      );
                    }),
                    catchError((error) => {
                      return throwError(
                        () => `Error al actualizar curso: ${error}`
                      );
                    })
                  );
              } else {
                console.log('error');
                this.sweetAlertService.showCustomAlert(
                  'Error',
                  `El estudiante: ${student.firstName} ${student.lastName} no se encuentra inscrito en el curso : ${course.name}`,
                  'error'
                );
                return EMPTY;
              }
            }),
            catchError((error) => {
              console.error('Error al obtener el curso: ', error);
              return EMPTY;
            })
          );
        })
      )
      .subscribe();
  }
}
