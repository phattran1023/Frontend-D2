import { Injectable, afterNextRender, afterRender } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderModel } from '../models/loader.model';
import { StorageModel } from '../models/storage.model';
import { IMessage } from '../models/message.model';
import { AppConstant } from '../../app.constant';
import { LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    loader = new LoaderModel();
    storage = new StorageModel();
    message: Subject<IMessage> = new Subject();

    constructor(
        private _localStorageService: LocalStorageService
    ) {
        afterNextRender(() => {
            this.storage.add(AppConstant.GLOBAL_STORAGE.TOKEN, this._localStorageService.get(AppConstant.LOCAL_STORAGE_KEYS.TOKEN));
            this.storage.add(AppConstant.GLOBAL_STORAGE.LOGIN_STATUS, this._localStorageService.get(AppConstant.LOCAL_STORAGE_KEYS.LOGIN_STATUS));    
            this.storage.add(AppConstant.GLOBAL_STORAGE.USER, null);    
        });
    }
}
