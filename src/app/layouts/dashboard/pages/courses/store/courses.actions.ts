import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ICourse } from '../models'
export const CoursesActions = createActionGroup({
  source: 'Courses',
  events: {
    'Load Courses': emptyProps(),
    'Load Courses Success': props<{ data: ICourse[] }>(),
    'Load Courses Failure': props<{ error: unknown }>(),
  }
});
