import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService} from '../services/auth.service'
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('authGuard');

  const router = inject(Router);
  const authService = inject(AuthService);
  

  return authService.authUser$.pipe(
    map((authUser) => {
      if(!authUser) {
        return  router.createUrlTree(['auth']);
      }
      return true;
    })
  );
  

};
