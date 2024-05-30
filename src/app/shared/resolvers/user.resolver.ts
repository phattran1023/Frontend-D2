import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { AuthApiService } from "../services/auth-api.service";
import { GlobalService } from "../../core/services/global.service";
import { Observable, forkJoin, take } from "rxjs";
import { AppConstant } from "../../app.constant";
import { PolicyService } from "../../core/policy/policy.service";

export const UserResolver: ResolveFn<Object> = (route, state) => {
    const authApiService = inject(AuthApiService);
    const globalService = inject(GlobalService);

    return new Observable(observer => {
        forkJoin([
            authApiService.getUserProfile(),
            authApiService.getUserPermission()
        ]).subscribe((data) => {
            globalService.storage.dispatch(AppConstant.GLOBAL_STORAGE.USER, data[0]);
            globalService.storage.dispatch(AppConstant.GLOBAL_STORAGE.USER_POLICY, data[1]);
            PolicyService.policies = data[1];
            observer.next(data[0]);
            observer.complete();
        })
    })
}

