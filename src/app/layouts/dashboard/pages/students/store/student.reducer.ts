import { createFeature, createReducer, on } from '@ngrx/store';
import { StudentActions } from './student.actions';
import { IStudent } from '../models';

export const studentFeatureKey = 'student';

export interface State {
  students: IStudent[];

}

export const initialState: State = {
  students: []
};

export const reducer = createReducer(
  initialState,
  on(StudentActions.loadStudents, state => state),
  on(StudentActions.loadStudentsSuccess, (state, action) => state),
  on(StudentActions.loadStudentsFailure, (state, action) => state),
);

export const studentFeature = createFeature({
  name: studentFeatureKey,
  reducer,
});

