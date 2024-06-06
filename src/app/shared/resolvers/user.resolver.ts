import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { AuthApiService } from "../services/auth-api.service";
import { GlobalService } from "../../core/services/global.service";
import { Observable, forkJoin, take } from "rxjs";
import { AppConstant } from "../../app.constant";
import { PermissionService } from "../../core/services/permission.service";

export const UserResolver: ResolveFn<Object> = (route, state) => {
    const authApiService = inject(AuthApiService);
    const globalService = inject(GlobalService);
    return new Observable(observer => {
        authApiService.getUserProfile().subscribe((data) => {
            globalService.storage.dispatch(AppConstant.GLOBAL_STORAGE.USER, data);
            observer.next(data);
            observer.complete();
        })
    })
}

