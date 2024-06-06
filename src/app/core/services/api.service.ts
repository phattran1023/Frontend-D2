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
    private apiHost = AppConstant.API_HOST; // api url server
    private apiUrlPrefix = AppConstant.API_URL_PREFIX; // prefix url
    private requestTimeout = AppConstant.DEFAULT_SETTINGS.REQUEST_TIMEOUT; // Set timout khi request api
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    // Set default option 
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
                // Lấy token của user đăng nhập gắn vào header để request api xuống BE
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

    // Xử lý nếu data có value là dạng Moment thì sẽ convert về date string
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

    // Merge options truyền vào với default options
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

    /* 
        Xử lý path url 
        Ví dụ có api update là: ‘item/:id' 
        update(data: { id:1, name: ‘abc' }) {
            const url = ‘item/’ + data.id // Cách 1
            const url = ‘item/:id' // Cách 2

            return this._apiService.get(url, data);
        }
        Nếu truyền theo cách 2 thì hàm createAPIUrl() sẽ kiếm id trong data để convert 
        url từ ‘item/:id' sang ‘item/1’ và sau đó remove key id
        => Kết quả:  url = ‘item/1’, data = { name: ‘abc' } 
    */
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
        // Xử lý data
        params = ApiService.pretreatmentDataRequest(params, options);
        //////////

        // Merge options với default options
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
        ///////

        // Xử lý path url
        const fullUrl = this.createAPIURL(url, params);
        ////////

        // Nếu loader là true thì sẽ hiển thị loader mỗi lần request api 
        if (options.loader) {
            // bật loader
            this._globalService.loader.loading();
            ////////
            return this._httpClient.get(fullUrl, options.requestOptions).pipe(
                timeout(this.requestTimeout),
                map(response => {
                    /*
                        Xử lý data trả về 
                        Ví dụ 
                            response = {
                                statusCode: 200,
                                data: {
                                    id: 1,
                                    name: 'abc'
                                }
                            }
                    */
                    return options.pretreatmentResponse ? response['data'] : response
                }),
                finalize(() => {
                    // tắt loader
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
