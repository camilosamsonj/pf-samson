import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { StudentsService } from '../students/students.service';
import { IUser } from '../users/models';
import { Observable, interval, map, tap } from 'rxjs';
import { IStudent } from '../students/models';
import { ICourse } from '../courses/models';
import { Store } from '@ngrx/store';
import { selectUsersList } from '../users/store/users.selectors';
import { selectCoursesList } from '../courses/store/courses.selectors';
import { selectStudentsList } from '../students/store/student.selectors';
import { TimeAndDateService } from '../../../../core/services/time-and-date.service';
import { UsersActions } from '../users/store/users.actions';
import { StudentActions } from '../students/store/student.actions';
import { CoursesActions } from '../courses/store/courses.actions';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

 users$: Observable<IUser[]>;
 courses$: Observable<ICourse[]>;
 students$: Observable<IStudent[]>;
 usersLength$: Observable<number>;
 coursesLength$: Observable<number>;
 studentsLength$: Observable<number>;



constructor(
private store: Store,
){

  this.users$ = this.store.select(selectUsersList)
  this.courses$ = this.store.select(selectCoursesList);
  this.students$ = this.store.select(selectStudentsList);
  this.usersLength$ = this.users$.pipe(
    map(users => users.length));
  this.coursesLength$ = this.courses$.pipe(
    map(courses => courses.length));
  this.studentsLength$ = this.students$.pipe(
    map(students => students.length));
}


  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
    this.store.dispatch(StudentActions.loadStudents());
    this.store.dispatch(CoursesActions.loadCourses());
  }



}
