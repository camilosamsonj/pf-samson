import { Injectable } from '@angular/core';
import { Observable, interval, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeAndDateService {

  constructor() { }



  getCurrentTime(): Observable<Date> {
    return interval(1000).pipe(
     map(() => new Date())
    );
   }

  getCurrentDate(): Observable<Date> {
    return of(new Date())
  }

}
