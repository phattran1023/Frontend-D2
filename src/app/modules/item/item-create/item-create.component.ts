import { Component, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { ItemFormComponent } from "../item-form/item-form.component";
import { ItemApiService } from "../../../shared/services/item-api.service";
import { GlobalService } from "../../../core/services/global.service";
import { MESSAGE_TYPE } from "../../../core/models/message.model";

@Component({
    selector: 'item-create',
    templateUrl: './item-create.component.html',
    styleUrl: './item-create.component.scss',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, ItemFormComponent],
})
export class ItemCreateComponent {
    @ViewChild(ItemFormComponent) itemForm?:ItemFormComponent

    constructor(
        private _itemApiService: ItemApiService,
        private _globalService: GlobalService,
        private _dialogRef: MatDialogRef<ItemCreateComponent>,
    ) {}

    submit() {
        const form = this.itemForm.form;

        if (form.invalid) {
            form.markAllAsTouched();
            return;
        }
        const data = form.getRawValue();
        this._itemApiService.create(data)
        .subscribe({
            next: (val) => {
                this._globalService.message.next({
                    type: MESSAGE_TYPE.success,
                    message: 'Create successfully!',
                });
                this._dialogRef.close(val);
            },
            error: (err) => {
                // Handle err
                this._globalService.message.next({
                    type: MESSAGE_TYPE.error,
                    message: 'Create error!',
                });
            }
        })
    }
}