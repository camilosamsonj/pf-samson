import { createFeature, createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { IUser } from '../models';

export const usersFeatureKey = 'users';

export interface State {
  loadingUsers: boolean;
  users: IUser[];
  error: unknown;

}

export const initialState: State = {
  loadingUsers: false,
  users: [],
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(UsersActions.loadUsers, state => {
    return {
      ...state,
      loadingUsers: true,
    }
  }),
  on(UsersActions.loadUsersSuccess, (state, action) => {
    return {
      ...state,
      loadingUsers: false,
      users: action.data,
    }
  }),
  on(UsersActions.loadUsersFailure, (state, action) => {
    return {
      ...state,
      error: action.error,

    }
  }),
);

export const usersFeature = createFeature({
  name: usersFeatureKey,
  reducer,
});

