import { BehaviorSubject, Subject } from 'rxjs';

export interface StorageItemInterface {
    [key: string]: BehaviorSubject<any> | Subject<any>;
}

export class LoaderModel {
    private loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private count = 0;

    get status() {
        return this.loaderStatus.asObservable();
    }

    loading() {
        this.count++;
        this.loaderStatus.next(!!this.count);
    }

    loaded() {
        this.count--;
        this.loaderStatus.next(!!this.count);
    }
}

