import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromStudent from './student.reducer';

export const selectStudentState = createFeatureSelector<fromStudent.State>(
  fromStudent.studentFeatureKey
);


export const selectStudentsList = createSelector(selectStudentState, (s) => s.students );

export const selectLoadingStudents = createSelector(selectStudentState,  (s) => s.loadingStudents);

export const selectErrorStudents = createSelector(selectStudentState,  (s) => s.error);