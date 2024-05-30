import { Injectable } from '@angular/core';
import { IStudent, CreateStudentPayload } from './models';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment'


@Injectable({
  providedIn: 'root',
})
export class StudentsService {

  constructor(private httpClient: HttpClient) {}


  getStudents(): Observable<IStudent[]> {
    return this.httpClient.get<IStudent[]>(environment.baseAPIURL + '/students');
  }

  getStudentById(id: string):Observable<IStudent> {
    return this.httpClient.get<IStudent>(`${environment.baseAPIURL}/students/${id}`);
    // return of(STUDENTS_DB.find((student)=> student.id === id));
  }

  createStudent(payload: CreateStudentPayload): Observable<IStudent>{
    return this.httpClient.post<IStudent>(`${environment.baseAPIURL}/students`, 
      payload);
    }
  
  deleteStudent(id: number): Observable<IStudent> {
    console.log('ejecutando el delete');
  return this.httpClient.delete<IStudent>(`${environment.baseAPIURL}/students/${id}`)
  }

  updateStudent(student: IStudent): Observable<IStudent> {
    console.log(student.id);
  return this.httpClient.put<IStudent>(`${environment.baseAPIURL}/students/${student.id}`, student);
  } 
}