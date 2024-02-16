import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const incompleteProfileGuard: CanActivateFn = (route, state) => {
  const user : any  =  JSON.parse(localStorage.getItem("loggedUser")!);
  if(user != null && user.name == null){
    return true;
  }
  const router = inject(Router);
  router.navigate(["/home"])
  return false;
};
