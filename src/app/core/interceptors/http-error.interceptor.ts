import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { AppConstant } from '../../app.constant';
import { MESSAGE_TYPE } from '../models/message.model';
import { HTTP_STATUS_CODE } from '../common/http-status-code';
import { ErrorService } from '../services/error.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private globalService: GlobalService
    ) {
    }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse | any) => {
                if (request.url.startsWith(AppConstant.API_HOST)) {
                    if (error instanceof HttpErrorResponse) {
                        if (AppConstant.APP_DEVELOPER_MODE) {
                            this.globalService.message.next({
                                type: MESSAGE_TYPE.error,
                                title: error.status + ' ' + error.statusText,
                                message: ErrorService.parseMessage(error.error)
                            });
                        }
                        const statusCodeExclude = request.headers.getAll(AppConstant.HTTP_STATUS_CODE_EXCLUDE);
                        if (statusCodeExclude && statusCodeExclude.find(code => +code === error.status)) {
                            return throwError(() => error.error);
                        }
                        switch (error.status) {
                            case HTTP_STATUS_CODE.UNAUTHORIZED:
                                if (this.router.url !== '/auth/logout' && this.router.url !== '/auth/login') {
                                    this.router.navigate(['/auth', 'logout']);
                                }
                                break;
                            case HTTP_STATUS_CODE.FORBIDDEN:
                                this.router.navigate(['/403']);
                                break;
                            case HTTP_STATUS_CODE.NOT_FOUND:
                                this.router.navigate(['/404']);
                                break;
                            case HTTP_STATUS_CODE.SERVICE_UNAVAILABLE:
                                this.router.navigate(['/503']);
                                break;
                        }
                        return throwError(() => error.error);
                    }
                }

                return throwError(() => error);
            })
        );
    }
}
