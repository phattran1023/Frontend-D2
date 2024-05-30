import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../../modules/auth/auth.service";
import { LocalStorageService } from "../services/local-storage.service";

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const localStorageService = inject(LocalStorageService);
  if (localStorageService.storage) {
    if (authService.isLoggedIn) {
      return true;
    } else {
      authService.redirectToLogin()
      return false;
    }
  } else {
    return false;
  }

};
