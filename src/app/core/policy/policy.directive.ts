import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    Renderer2,
    ViewContainerRef
} from '@angular/core';
import { PolicyService } from './policy.service';

@Directive({
    selector: '[appPolicy]'
})
export class PolicyDirective implements OnChanges {
    @Input() policy: string;
    @Input() postAction: 'hide' | 'delete' | 'disable' | 'custom' | ((el) => void) = 'delete';
    @Input() customClasses: string | string[];

    constructor(
        private _elementRef: ElementRef,
        private _renderer: Renderer2,
        private _policyService: PolicyService,
        private _viewContainerRef: ViewContainerRef,
    ) {
    }

    ngOnChanges(): void {
        this.handle();
    }

    check(policy: string, args: any[] = []) {
        return this._policyService.can(policy, ...args);
    }

    parsePolicy() {
        const [policy, params] = this.policy ? this.policy.split('|') : [undefined, undefined];
        const args = params ? params.split('&') : [];
        return {
            policy: policy,
            args: args
        };
    }

    async handle() {
        const {policy, args} = this.parsePolicy();
        if (!policy) {
            return;
        }

        const checkResult = this.check(policy, args);
        if (!checkResult) {
            if (typeof this.postAction === 'string') {
                switch (this.postAction) {
                    case 'delete': {
                        this.delete();
                        break;
                    }
                    case 'disable': {
                        this.disable();
                        break;
                    }
                    case 'hide': {
                        this.hide();
                        break;
                    }
                    case 'custom': {
                        this.custom();
                        break;
                    }
                    default: {
                        this.delete();
                    }

                }
            } else if (typeof this.postAction === 'function') {
                this.postAction(this._elementRef);
            }
        }
    }

    hide() {
        this._elementRef.nativeElement.style.display = 'none';
        this._elementRef.nativeElement.classList.add(this.customClasses);
    }

    disable() {
        this._renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'true');
        this._elementRef.nativeElement.style.cursor = 'not-allowed';
        this._elementRef.nativeElement.style.pointerEvents = 'none';
        this._elementRef.nativeElement.classList.add(this.customClasses);
    }

    delete() {
        this._viewContainerRef.clear();
        this._elementRef.nativeElement.remove();
    }

    custom() {
        this._elementRef.nativeElement.classList.add(this.customClasses);
    }
}
