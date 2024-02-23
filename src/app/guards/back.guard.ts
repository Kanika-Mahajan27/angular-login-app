import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const backGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if(loginService.getLoggedUser() === null){
    return true;
  }
  router.navigate(["/home"]);
  return false;
};
