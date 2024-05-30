import { Injectable } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { BasePolicyCollection } from './base.policy-collection';
import { AppConstant } from '../../app.constant';

@Injectable()
export class PolicyService {
    private static policyCollections = {};
    static policies: Array<string> = [];

    static parsePolicy(policy: string) {
        const tmp = policy.split('::');
        return {
            policyCollection: tmp[0],
            action: tmp[1]
        };
    }

    constructor(
        private _globalService: GlobalService
    ) {
        this._globalService.storage.watch(AppConstant.GLOBAL_STORAGE.USER_POLICY)
        .subscribe((policies: string[]) => {
            PolicyService.policies = policies;
        })
    }

    registerPolicyCollection<T extends BasePolicyCollection>(policies: T[]) {
        policies.forEach(policy => {
            PolicyService.policyCollections[policy.policyCollectionKey] = policy;
        });

        return this;
    }

    getPolicyCollection(policyCollectionKey) {
        return PolicyService.policyCollections[policyCollectionKey] || null;
    }

    getPolicyCollections() {
        return PolicyService.policyCollections;
    }

    can<T extends BasePolicyCollection>(policy: string, ...args) {
        const { policyCollection, action } = PolicyService.parsePolicy(policy);
        let policyCollectionInstance;
        policyCollectionInstance = PolicyService.policyCollections[policyCollection];
        if (!policyCollectionInstance) {
            console.warn(`The ${policyCollection} PolicyCollection is not found`)
            return false;
        }
        if (!policyCollectionInstance[action]) {
            console.warn(`The ${action} of ${policyCollection} PolicyCollection is not found`)
            return false;
        }
        return policyCollectionInstance[action](...args);
    }

    has(policy: string): boolean {
        // Check permission of user
        return PolicyService.policies.includes(policy);
    }
}

