import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IUser } from '../models';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ data: IUser[] }>(),
    'Load Users Failure': props<{ error: unknown }>(),
  }
});
