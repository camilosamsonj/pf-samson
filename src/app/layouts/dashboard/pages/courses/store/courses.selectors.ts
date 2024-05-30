import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCourses from './courses.reducer';

export const selectCoursesState = createFeatureSelector<fromCourses.State>(
  fromCourses.coursesFeatureKey
);


export const selectCoursesList = createSelector(selectCoursesState, (s) => s.courses );

export const selectLoadingCourses = createSelector(selectCoursesState, (s) => s.loadingCourses);

export const selectCoursesError = createSelector(selectCoursesState, (s) => s.error );