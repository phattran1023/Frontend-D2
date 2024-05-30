import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

export interface StorageItemInterface {
    [key: string]: BehaviorSubject<any> | Subject<any>;
}

export class StorageModel {
    private storage: StorageItemInterface = {};

    view() {
        return this.storage;
    }

    add(key: string, data: any) {
        this.storage[key] = new BehaviorSubject(data);
    }

    dispatch(key: string, data: any) {
        if (!this.storage[key]) {
            this.add(key, data);
        } else {
            this.storage[key].next(data);
        }
    }

    watch(key: string): Observable<any> {
        return this.storage[key] ? this.storage[key].asObservable() : of();
    }

    remove(key: string) {
        this.storage[key].complete();
        delete this.storage[key];
    }

    get(key: string) {
        return (this.storage[key] as BehaviorSubject<any>).value;
    }
}

