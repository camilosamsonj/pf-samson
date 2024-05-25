import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const StudentActions = createActionGroup({
  source: 'Student',
  events: {
    'Load Students': emptyProps(),
    'Load Students Success': props<{ data: unknown }>(),
    'Load Students Failure': props<{ error: unknown }>(),
  }
});
