import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface IApiOption {
    exposeHeaders?: {
        [key: string]: string | string[]
    };
    loader?: boolean;
    pretreatmentResponse?: boolean;
    requestOptions?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: string | any;
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: string | any;
        withCredentials?: boolean;
    };
}
