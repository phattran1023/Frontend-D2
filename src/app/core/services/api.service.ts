import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, map, timeout } from 'rxjs/operators';
import { GlobalService } from './global.service';
import * as moment from 'moment';
import { AppConstant } from '../../app.constant';
import { IApiOption } from '../models/api-option.model';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiHost = AppConstant.API_HOST;
    private apiUrlPrefix = AppConstant.API_URL_PREFIX;
    private requestTimeout = AppConstant.DEFAULT_SETTINGS.REQUEST_TIMEOUT;
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    });
    private defaultOptions: IApiOption = {
        loader: true,
        pretreatmentResponse: true,
        requestOptions: {
            headers: this.headers
        }
    };

    constructor(
        private _httpClient: HttpClient,
        private _globalService: GlobalService
    ) {
        this._globalService.storage
            .watch(AppConstant.GLOBAL_STORAGE.TOKEN)
            .subscribe(token => {
                this.headers = this.headers.set('Authorization', `Bearer ${token}`);
                if (this.defaultOptions.requestOptions) {
                    this.defaultOptions.requestOptions.headers = this.headers
                }
            });
    }

    static pretreatmentDataRequest(data: any, options: IApiOption) {
        data = ApiService.formatMomentObject(data);
        return data;
    }

    static formatMomentObject(data: any) {
        if (data && typeof data === 'object') {
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'object') {
                    if (moment.isMoment(data[key])) {
                        data[key] = data[key].format();
                    } else {
                        data[key] = ApiService.formatMomentObject(data[key]);
                    }
                }
            });
        }
        return data;
    }

    static normalizeOption(options: IApiOption, optionsMatching: IApiOption): IApiOption {
        if (!optionsMatching) {
            return options;
        }
        let results = {...options};
        optionsMatching.requestOptions = {...results.requestOptions, ...optionsMatching.requestOptions};
        results = {...results, ...optionsMatching};
        const temp = optionsMatching.exposeHeaders

        if (optionsMatching.exposeHeaders) {
            Object.keys(optionsMatching.exposeHeaders).forEach(key => {
                const headers = results.requestOptions.headers as HttpHeaders;
                results.requestOptions.headers = headers.set(key, optionsMatching.exposeHeaders[key]);
            });
        }
        return results;
    }

    createAPIURL(url: string, params: HttpParams): string {
        const paths = url.split('/');
        paths.forEach((path, i) => {
            if (path.startsWith(':')) {
                const key = path.slice(1);
                paths[i] = params[key];
                delete params[key];
            }
        });

        return this.apiHost + this.apiUrlPrefix + paths.join('/');
    }

    get(url: string, params?: HttpParams | any, options?: IApiOption): Observable<any> {
        params = ApiService.pretreatmentDataRequest(params, options);
        const defaultRequestOptions = {
            ...this.defaultOptions,
            ...{
                requestOptions: {
                    params: params,
                    headers: this.headers
                }
            }
        };
        options = ApiService.normalizeOption(defaultRequestOptions, options);
        const fullUrl = this.createAPIURL(url, params);
        if (options.loader) {
            this._globalService.loader.loading();
            return this._httpClient.get(fullUrl, options.requestOptions).pipe(
                timeout(this.requestTimeout),
                map(response => options.pretreatmentResponse ? response['data'] : response),
                finalize(() => {
                    this._globalService.loader.loaded();
                })
            );
        } else {
            return this._httpClient.get(fullUrl, options.requestOptions).pipe(
                timeout(this.requestTimeout),
                map(response => options.pretreatmentResponse ? response['data'] : response)
            );
        }
    }

    post(url: string, params?: any, options?: IApiOption): Observable<any> {
        params = ApiService.pretreatmentDataRequest(params, options);
        options = ApiService.normalizeOption(this.defaultOptions, options);
        const fullUrl = this.createAPIURL(url, params);
        if (options.loader) {
            this._globalService.loader.loading();
            return this._httpClient
                       .post(fullUrl, params, options.requestOptions)
                       .pipe(
                           timeout(this.requestTimeout),
                           map(response => options.pretreatmentResponse ? response['data'] : response),
                           finalize(() => {
                               this._globalService.loader.loaded();
                           })
                       );
        } else {
            return this._httpClient
                       .post(fullUrl, params, options.requestOptions)
                       .pipe(
                           timeout(this.requestTimeout),
                           map(response => options.pretreatmentResponse ? response['data'] : response),
                       );
        }
    }

    put(url: string, params?: any, options?: IApiOption): Observable<any> {
        params = ApiService.pretreatmentDataRequest(params, options);
        options = ApiService.normalizeOption(this.defaultOptions, options);
        const fullUrl = this.createAPIURL(url, params);
        if (options.loader) {
            this._globalService.loader.loading();
            return this._httpClient
                       .put(fullUrl, params, options.requestOptions)
                       .pipe(
                           timeout(this.requestTimeout),
                           map(response => options.pretreatmentResponse ? response['data'] : response),
                           finalize(() => {
                               this._globalService.loader.loaded();
                           })
                       );
        } else {
            return this._httpClient
                       .put(fullUrl, params, options.requestOptions)
                       .pipe(
                           timeout(this.requestTimeout),
                           map(response => options.pretreatmentResponse ? response['data'] : response)
                       );
        }
    }

    patch(url: string, params?: any, options?: IApiOption): Observable<any> {
        params = ApiService.pretreatmentDataRequest(params, options);
        options = ApiService.normalizeOption(this.defaultOptions, options);
        const fullUrl = this.createAPIURL(url, params);
        if (options.loader) {
            this._globalService.loader.loading();
            return this._httpClient
                       .patch(fullUrl, params, options.requestOptions)
                       .pipe(
                           timeout(this.requestTimeout),
                           map(response => options.pretreatmentResponse ? response['data'] : response),
                           finalize(() => {
                               this._globalService.loader.loaded();
                           })
                       );
        } else {
            return this._httpClient
                       .patch(fullUrl, params, options.requestOptions)
                       .pipe(
                           timeout(this.requestTimeout),
                           map(response => options.pretreatmentResponse ? response['data'] : response)
                       );
        }
    }

    delete(url: string, params?: any, options?: IApiOption): Observable<any> {
        params = ApiService.pretreatmentDataRequest(params, options);
        const defaultRequestOptions = {
            ...this.defaultOptions,
            ...{
                requestOptions: {
                    body: params,
                    headers: this.headers
                }
            }
        };
        options = ApiService.normalizeOption(defaultRequestOptions, options);
        const fullUrl = this.createAPIURL(url, params);
        if (options.loader) {
            this._globalService.loader.loading();
            return this._httpClient
                       .delete(fullUrl, options.requestOptions)
                       .pipe(
                           timeout(this.requestTimeout),
                           map(response => options.pretreatmentResponse ? response['data'] : response),
                           finalize(() => {
                               this._globalService.loader.loaded();
                           })
                       );
        } else {
            return this._httpClient
                       .delete(fullUrl, options.requestOptions)
                       .pipe(
                           timeout(this.requestTimeout),
                           map(response => options.pretreatmentResponse ? response['data'] : response)
                       );
        }
    }


}
