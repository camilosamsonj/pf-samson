import { createFeature, createReducer, on } from '@ngrx/store';
import { StudentActions } from './student.actions';
import { IStudent } from '../models';

export const studentFeatureKey = 'student';

export interface State {
  loadingStudents: boolean;
  students: IStudent[];
  error: unknown;

}

export const initialState: State = {
  loadingStudents: false,
  students: [],
  error: null,
  
};

export const reducer = createReducer(
  initialState,
  //disparador
  on(StudentActions.loadStudents, state => {
    return {
      ...state,
      loadingStudents: true,
    }
  }),
  //success
  on(StudentActions.loadStudentsSuccess, (state, action) => {
    return {
      ...state,
      students: action.data, 
      loadingStudents: false,
    }
  }),
  //error
  on(StudentActions.loadStudentsFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      loadingStudents: false,
    }
  }),
);

export const studentFeature = createFeature({
  name: studentFeatureKey,
  reducer,
});

