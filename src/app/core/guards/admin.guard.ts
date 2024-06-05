import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../store/auth/auth.selectors';


export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectAuthUser).pipe(
    map((user) => {
      return user?.role === 'ADMIN' ? true : router.createUrlTree(['dashboard', 'home']);
    })
  )
}


