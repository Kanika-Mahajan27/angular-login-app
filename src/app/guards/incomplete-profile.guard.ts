import { CanActivateFn } from '@angular/router';

export const incompleteProfileGuard: CanActivateFn = (route, state) => {
  const user : any  =  JSON.parse(localStorage.getItem("loggedUser")!);
  if(user != null && user.name == null){
    return true;
  }
  window.location.href = "home";
  return false;
};
