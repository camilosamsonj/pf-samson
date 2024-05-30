import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { IStudent } from '../students/models';
import { ICourse } from '../courses/models';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  apiURL = environment.baseAPIURL;

  constructor(
    private httpClient: HttpClient,
    private studentsService: StudentsService,
    private coursesService: CoursesService
  ) {}


  
  enrollStudentInCourse(
    studentId: string,
    course: ICourse
  ): Observable<IStudent> {
    return this.httpClient
      .get<IStudent>(`${this.apiURL}/students/${studentId}`)
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error('Error al obtener el estudiante'));
        }),
        switchMap((student: IStudent) => {
          if (!student.courses) {
            student.courses = [];
          }
          student.courses.push(course);
          return this.httpClient
            .put<IStudent>(`${this.apiURL}/students/${studentId}`, student)
            .pipe(
              catchError((error) => {
                console.log(error);
                return throwError(() => new Error('Error'));
              }),
              tap(() => {
                console.log(
                  'Estudiante actualizado con el nuevo curso',
                  student
                );
              })
            );
        })
      );
  }

  addStudentsToCourse(
    courseId: string,
    student: IStudent
  ): Observable<ICourse> {
    return this.httpClient
      .get<ICourse>(`${this.apiURL}/courses/${courseId}`)
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error('Error al obtener el curso'));
        }),
        switchMap((course: ICourse) => {
          if (!course.students) {
            course.students = [];
          }
          course.students.push(student);
          return this.httpClient
            .put<ICourse>(`${this.apiURL}/courses/${courseId}`, course)
            .pipe(
              catchError((error) => {
                console.log(error);
                return throwError(() => new Error('Error'));
              }),
              tap(() => {
                console.log('Curso actualizado con el nuevo estudiante');
              })
            );
        })
      );
  }

  unenrollStudentFromCourse(
    studentId: string,
    courseId: string,
    student: IStudent
  ): Observable<ICourse | null> {
    return this.httpClient
      .get<IStudent>(`${this.apiURL}/students/${studentId}`)
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error('Error al obtener el estudiante'));
        }),
        switchMap((student: IStudent) => {
          if (!student) {
            console.warn(
              'No se encontró ningun estudiante con el ID: ',
              studentId
            );
            return throwError(
              () =>
                new Error(
                  'No se encontró ningún estudiante con el ID proporcionado'
                )
            );
          }
          if (!student.courses || student.courses.length === 0) {
            console.warn('El estudiante no está inscrito en ningún curso');
            return of(null); // No hay cambios, devuelve null
          }

          const courseIndex = student.courses.findIndex(
            (course) => course.id.toString() === courseId
          );
          if (courseIndex === -1) {
            console.warn(
              'El estudiante no está inscrito en el curso con ID:',
              courseId
            );
            return of(null); // No hay cambios, devuelve null
          }

          student.courses.splice(courseIndex, 1); // Eliminar el curso del array de cursos del estudiante

          // Actualizar los datos del estudiante en el servidor
          return this.httpClient
            .put<IStudent>(`${this.apiURL}/students/${studentId}`, student)
            .pipe(
              catchError((error) => {
                console.error('Error al actualizar el estudiante', error);
                return throwError(
                  () => new Error('Error al actualizar el estudiante')
                );
              }),
              switchMap(() => {
                // Devolver el curso con los cambios realizados
                return this.httpClient.get<ICourse>(
                  `${this.apiURL}/courses/${courseId}`
                ).pipe(
                  catchError(() => {
                    return of(null);
                  })
                );
              })
            );
        })
      );
  }

  updateCourseAfterStudentRemoval(
    courseId: string,
    studentId: string
  ): Observable<ICourse> {
    return this.httpClient
      .get<ICourse>(`${this.apiURL}/courses/${courseId}`)
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error('Error al obtener el curso'));
        }),
        switchMap((course: ICourse) => {
          if (!course.students || course.students.length === 0) {
            console.warn('El curso no tiene estudiantes inscritos');
            return of(course); // No hay cambios, devuelve el curso original
          }
          const studentIndex = course.students.findIndex(
            (student) => student.id.toString() === studentId
          );
          if (studentIndex === -1) {
            console.warn('El curso no tiene al estudiante con ID:', studentId);
            return of(course); // No hay cambios, devuelve el curso original
          }
          course.students.splice(studentIndex, 1); // Eliminar al estudiante del array de estudiantes del curso
          // Actualizar los datos del curso en el servidor
          return this.httpClient
            .put<ICourse>(`${this.apiURL}/courses/${courseId}`, course)
            .pipe(
              catchError((error) => {
                console.error('Error al actualizar el curso', error);
                return throwError(
                  () => new Error('Error al actualizar el curso')
                );
              })
            );
        })
      );
  }
}