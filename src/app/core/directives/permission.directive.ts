import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from "@angular/core";
import { PermissionService } from "../services/permission.service";

@Directive({
    selector: '[appPermission]',
    standalone: true
})
export class PermissionDirective implements OnChanges {
    @Input() permission: string;
    
    constructor(
        private _elementRef: ElementRef,
        private _permissionService: PermissionService,
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.handle();
    }

    check(permission: string) {
        return this._permissionService.can(permission);
    }

    handle() {
        const checkResult = this.check(this.permission);
        if (!checkResult) {
            // Hide html element
            this._elementRef.nativeElement.style.display = 'none';
        }
    }
}