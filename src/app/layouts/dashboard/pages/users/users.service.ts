import { Injectable } from '@angular/core';
import { CreateUserPayload, IUser } from './models';
import {

  map,
  Observable,
  of,

} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root',
})

export class UsersService {

  constructor(private httpClient: HttpClient,
    private router: Router
   ) {}

  getUsers(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(environment.baseAPIURL + '/users');
  }

  getUserById(id: string): Observable<IUser>{
    return this.httpClient.get<IUser>(`${environment.baseAPIURL}/users/${id}`);
  }

  getUserByEmail(email: string | null): Observable<IUser | undefined> {
    if (!email) {
      return of(undefined); // Si el correo electrónico es nulo, devuelve un Observable de usuario indefinido
    }
    return this.getUsers().pipe(
      map(users => users.find(user => user.email === email))
    );
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
