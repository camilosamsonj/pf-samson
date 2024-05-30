import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUsers from './users.reducer';

export const selectUsersState = createFeatureSelector<fromUsers.State>(
  fromUsers.usersFeatureKey
);

export const selectUsersList = createSelector(selectUsersState, (s) => s.users);

export const selectLoadingUsers = createSelector(selectUsersState, (s) => s.loadingUsers);

export const selectUsersError = createSelector(selectUsersState, (s) => s.error);