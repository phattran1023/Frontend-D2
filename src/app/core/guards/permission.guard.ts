import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Observable, of, switchMap } from "rxjs";
import { AuthApiService } from "../../shared/services/auth-api.service";
import { PermissionService } from "../services/permission.service";
import { GlobalService } from "../services/global.service";
import { AppConstant } from "../../app.constant";
import { UserModel } from "../../shared/models/user.model";


export const PermissionGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    if (!route.data || !route.data['permission']) {
        return false;
    }
    const permissionService = inject(PermissionService);
    const router = inject(Router);
    const authApiService = inject(AuthApiService)
    const globalService = inject(GlobalService);

    return new Observable(observer => {
      globalService.storage.watch(AppConstant.GLOBAL_STORAGE.USER)
      .pipe(switchMap((data: UserModel) => {
        if(!data) {
          return authApiService.getUserProfile();
        }
        return of(data)
      }))
      .subscribe(user => {
        PermissionService.permissions = user.permissions;
        if (permissionService.can(route.data['permission'])) {
          observer.next(true);
          observer.complete();
        } else {
            observer.next(router.createUrlTree(['/403']));
            observer.complete();
        }
      })
    });
  }