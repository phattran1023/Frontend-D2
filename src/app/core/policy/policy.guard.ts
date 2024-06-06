import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { PolicyService } from "./policy.service";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthApiService } from "../../shared/services/auth-api.service";


export const PolicyGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    if (!route.data || !route.data['policy']) {
        return false;
    }
    const policyService = inject(PolicyService);
    const router = inject(Router);
    const authApiService = inject(AuthApiService)

    return new Observable(observer => {
        // Get permission of user to check
        // authApiService.getUserPermission().subscribe((data) => {
        //     PolicyService.policies = data;
        //     if (policyService.can(route.data['policy'])) {
        //         observer.next(true);
        //         observer.complete();
        //     } else {
        //         observer.next(router.createUrlTree(['/403']));
        //         observer.complete();
        //     }
        // })
        observer.next(true);
        observer.complete();
    });
  }