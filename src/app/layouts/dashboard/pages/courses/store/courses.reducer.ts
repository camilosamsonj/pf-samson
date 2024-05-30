import { createFeature, createReducer, on } from '@ngrx/store';
import { CoursesActions } from './courses.actions';
import { ICourse } from '../models';

export const coursesFeatureKey = 'courses';

export interface State {
  loadingCourses: boolean;
  courses: ICourse[];
  error: unknown;

}

export const initialState: State = {
loadingCourses: false,
courses: [],
error: null,
};

export const reducer = createReducer(
  initialState,
  on(CoursesActions.loadCourses, state => {
    return {
      ...state, 
      loadingCourses: true,
    }
  }),
  on(CoursesActions.loadCoursesSuccess, (state, action) => {
    return {
      ...state,
      courses: action.data,
      loadingCourses: false,
    }
  }),
  on(CoursesActions.loadCoursesFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      loadingCourses: false,
    }
  }),
);

export const coursesFeature = createFeature({
  name: coursesFeatureKey,
  reducer,
});

