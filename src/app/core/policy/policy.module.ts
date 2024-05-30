import {
    Injector,
    ModuleWithProviders,
    NgModule,
    Provider,
} from '@angular/core';
import { PolicyService } from './policy.service';
import { BasePolicyCollection } from './base.policy-collection';
import { PolicyDirective } from './policy.directive';
import { ItemPolicyCollection } from '../../modules/item/item.policy-collection';

export interface PolicyProvider<T extends BasePolicyCollection> {
    policy: new (...args) => T;
    deps: (new (...args) => T)[];
}

export type PolicyCollection<T extends BasePolicyCollection> = new (
    ...args
) => T;
export const registeredPolicies = [
    BasePolicyCollection,
    ItemPolicyCollection
];

@NgModule({
    imports: [],
    declarations: [PolicyDirective],
    exports: [PolicyDirective],
    providers: [
        PolicyService,
    ],
})
export class PolicyModule {
    constructor(
        private policyServices: PolicyService,
        private injector: Injector
    ) {
        const policies = this.injector.get(BasePolicyCollection) as any;
        this.policyServices.registerPolicyCollection(policies);
    }

    static forRoot<T extends BasePolicyCollection>(
        policies?: PolicyCollection<T>[] | PolicyProvider<T>[] | any[],
        config?: any
    ): ModuleWithProviders<PolicyModule> {
        return {
            ngModule: PolicyModule,
            providers: loadProviders(policies, true),
        };
    }

    static forChild<T extends BasePolicyCollection>(
        policies?: PolicyCollection<T>[] | PolicyProvider<T>[] | any[]
    ): ModuleWithProviders<PolicyModule> {
        return {
            ngModule: PolicyModule,
            providers: loadProviders(policies),
        };
    }
}

function loadProviders<T extends BasePolicyCollection>(
    policies: PolicyCollection<T>[] | PolicyProvider<T>[] | any[],
    loadDefaultPolicies = false
) {
    const providers: Provider[] = [];
    if (!policies && loadDefaultPolicies) {
        policies = registeredPolicies as PolicyCollection<T>[];
    }
    if (policies) {
        policies.forEach((policy) => {
            if (typeof policy === 'object') {
                providers.push({
                    provide: BasePolicyCollection,
                    useClass: policy.policy,
                    deps: policy.deps,
                    multi: true,
                });
                policy.deps.forEach((dep) => {
                    providers.push({
                        provide: dep,
                    });
                });
            } else {
                providers.push({
                    provide: BasePolicyCollection,
                    useClass: policy,
                    multi: true,
                });
            }
        });
    }

    return providers;
}
