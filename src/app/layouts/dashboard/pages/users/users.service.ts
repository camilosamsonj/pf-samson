import { Injectable } from '@angular/core';
import { CreateUserPayload, IUser } from './models';
import {
  catchError,
  concatMap,
  delay,
  first,
  forkJoin,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';



@Injectable({
  providedIn: 'root',
})

export class UsersService {

  constructor(private httpClient: HttpClient ) {}

  getUsers(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(environment.baseAPIURL + '/users');
  }

  getUserById(id: string): Observable<IUser>{
    return this.httpClient.get<IUser>(`${environment.baseAPIURL}/users/${id}`);
  }


  createUser(payload: CreateUserPayload): Observable<IUser> {
    return this.httpClient.post<IUser>(`${environment.baseAPIURL}/users`, payload)
  }

  deleteUser(id: number): Observable<IUser> {
    return this.httpClient.delete<IUser>(`${environment.baseAPIURL}/users/${id}`);
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.httpClient.put<IUser>(`${environment.baseAPIURL}/users/${user.id}`, user);
  }

}
