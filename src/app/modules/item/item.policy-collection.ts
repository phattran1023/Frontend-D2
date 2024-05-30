import { Injectable } from "@angular/core";
import { BasePolicyCollection } from "../../core/policy/base.policy-collection";

@Injectable()
export class ItemPolicyCollection extends BasePolicyCollection {
    override readonly policyCollectionKey = 'item';

    download(): boolean {
        // return this._policyService.has('item::download');
        return true;
    }
}
