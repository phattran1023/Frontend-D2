import { environment } from "../environments/environment";


export class AppConstant {
    static API_HOST = environment.apiHost;
    static API_URL_PREFIX = environment.apiPrefix;
    static APP_DEVELOPER_MODE = environment.developerMode;


    
    static HTTP_STATUS_CODE_EXCLUDE = 'http-status-code-exclude';
    static DEFAULT_SETTINGS = {
        REQUEST_TIMEOUT: 30000,
    };

    static LOCAL_STORAGE_KEYS = {
        TOKEN: 'access_token',
        LOGIN_STATUS: 'login_status',
    };

    static GLOBAL_STORAGE = {
        TOKEN: 'token',
        LOGIN_STATUS: 'login_status',
        USER: 'user',
        USER_POLICY: 'user_policy'
    };
}