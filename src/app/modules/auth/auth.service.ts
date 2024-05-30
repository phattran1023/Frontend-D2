import { Location } from "@angular/common";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstant } from '../../app.constant';
import { GlobalService } from '../../core/services/global.service';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private _globalService: GlobalService,
        private _router:Router,
        private _location: Location,
        private _localStorageService: LocalStorageService,
    ) {

    }

    get isLoggedIn() {
        const isLogged = this._globalService.storage.get(AppConstant.GLOBAL_STORAGE.LOGIN_STATUS);
        const currToken = this._globalService.storage.get(AppConstant.GLOBAL_STORAGE.TOKEN);
        return isLogged && currToken;
    }

    setLoggedIn(data: { accessToken: string}) {
        if (this._localStorageService.storage) {
            this._localStorageService.set(AppConstant.LOCAL_STORAGE_KEYS.TOKEN, data.accessToken);
            this._localStorageService.set(AppConstant.LOCAL_STORAGE_KEYS.LOGIN_STATUS, true);
        }
        this._globalService.storage.dispatch(AppConstant.GLOBAL_STORAGE.TOKEN, data.accessToken);
        this._globalService.storage.dispatch(AppConstant.GLOBAL_STORAGE.LOGIN_STATUS, true);
    }

    logout() {
        if (this._localStorageService.storage) {
            this._localStorageService.remove(AppConstant.LOCAL_STORAGE_KEYS.TOKEN);
            this._localStorageService.remove(AppConstant.LOCAL_STORAGE_KEYS.LOGIN_STATUS);
        }
        this._globalService.storage.dispatch(AppConstant.GLOBAL_STORAGE.TOKEN, null);
        this._globalService.storage.dispatch(AppConstant.GLOBAL_STORAGE.LOGIN_STATUS, false);
    }
    redirectToLogin():void{
        const currentUrl = this._location.path(true);
        this._router.navigate(['/auth/login'], {
          queryParams: { redirectUrl: currentUrl }
        });
    }
}
