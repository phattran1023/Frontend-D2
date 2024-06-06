import { Injectable } from "@angular/core";
import { GlobalService } from "./global.service";
import { AppConstant } from "../../app.constant";
import { UserModel } from "../../shared/models/user.model";


@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    static permissions: string[] = [];

    constructor(
        private _globalService: GlobalService
    ) {
        this._globalService.storage.watch(AppConstant.GLOBAL_STORAGE.USER)
        .subscribe((user: UserModel) => {
            if (user) {
                PermissionService.permissions = user.permissions;
            }
        });
    }

    can(permission: string): boolean {
        return PermissionService.permissions && PermissionService.permissions.includes(permission);
    }
}