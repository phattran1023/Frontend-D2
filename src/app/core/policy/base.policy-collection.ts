import { Injectable } from '@angular/core';
import { PolicyService } from './policy.service';

@Injectable()
export class BasePolicyCollection {
    policyCollectionKey = 'base';

    constructor(protected _policyService: PolicyService) {}

    create(): boolean {
        return this._policyService.has(`${this.policyCollectionKey}::create`);
    }

    update(): boolean {
        return this._policyService.has(`${this.policyCollectionKey}::update`);
    }

    read(): boolean {
        return this._policyService.has(`${this.policyCollectionKey}::read`);
    }

    delete(): boolean {
        return this._policyService.has(`${this.policyCollectionKey}::delete`);
    }
}
