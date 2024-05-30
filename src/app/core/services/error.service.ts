import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ErrorService extends ErrorHandler {

    constructor() {
        super();
    }

    static parseMessage(error: any) {
        if (error && error.statusCode === 404) {
            return ErrorService.joinMessages(error.message);
        } else if (error && error.statusCode === 403) {
            return ErrorService.joinMessages(error.error);
        } else if (error && error.statusCode === 400) {
            return ErrorService.joinMessages(error.error);
        }

        return error.message || error.error;
    }

    static joinMessages(error: any) {
        let message = '';
        if (typeof error === 'string') {
            return error + '<br>';
        } else if (typeof error === 'object') {
            Object.keys(error).forEach((key) => {
                message += ErrorService.joinMessages(error[key]);
            });
        }

        return message;
    }
}
