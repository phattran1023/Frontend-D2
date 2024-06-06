import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { ApiService } from '../../core/services/api.service';
import { AppConstant } from '../../app.constant';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    static LOGIN = 'auth';
    static USER_PROFILE = 'auth';
   
    constructor(private apiService: ApiService) {
    }

    login(data: { username: string; password: string; }): Observable<any> {
        return this.apiService.post(AuthApiService.LOGIN, data, {
            exposeHeaders: {
                [AppConstant.HTTP_STATUS_CODE_EXCLUDE]: ['401', '403']
            }
        });
    }

    getUserProfile(): Observable<UserModel> {
        return this.apiService.get(AuthApiService.USER_PROFILE).pipe(map(res => UserModel.fromJson(res)));
    }
}
