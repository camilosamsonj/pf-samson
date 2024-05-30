import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IStudent } from '../models';

export const StudentActions = createActionGroup({
  source: 'Student',
  events: {
    'Load Students': emptyProps(),
    'Load Students Success': props<{ data: IStudent[] }>(),
    'Load Students Failure': props<{ error: unknown }>(),
  }
});
