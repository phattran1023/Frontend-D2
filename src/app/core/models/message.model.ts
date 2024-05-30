import { IndividualConfig } from 'ngx-toastr/toastr/toastr-config';

export const MESSAGE_TYPE = {
    show: 'show',
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
};

export interface IMessage {
    type: string;
    title?: string;
    message: string;
    options?: Partial<IndividualConfig>;
}
