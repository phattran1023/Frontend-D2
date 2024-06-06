import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface IApiOption {
    /*
        Sử dụng key AppConstant.HTTP_STATUS_CODE_EXCLUDE sẽ bỏ qua việc xử lý lỗi ở http-error.interceptor.ts
        Ví dụ:
        return this.apiService.post(AuthApiService.LOGIN, data, {
            exposeHeaders: {
                [AppConstant.HTTP_STATUS_CODE_EXCLUDE]: ['401', '403']
            }
        });
    */
    exposeHeaders?: {
        [key: string]: string | string[]
    };
    loader?: boolean; // Dùng để hiển thị loader trong hệ thống
    pretreatmentResponse?: boolean; // Xử lý data trả về 
    requestOptions?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        params?: HttpParams | {
            [param: string]: string | string[];
        }; 
    };
}
