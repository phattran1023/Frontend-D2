import { Component, Inject, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { ItemFormComponent } from "../item-form/item-form.component";
import { ItemApiService } from "../../../shared/services/item-api.service";
import { GlobalService } from "../../../core/services/global.service";
import { MESSAGE_TYPE } from "../../../core/models/message.model";
import { ItemModel } from "../../../shared/models/item.model";

@Component({
    selector: 'item-update',
    templateUrl: './item-update.component.html',
    styleUrl: './item-update.component.scss',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, ItemFormComponent],
})
export class ItemUpdateComponent {
    @ViewChild(ItemFormComponent) itemForm?:ItemFormComponent

    constructor(
        private _itemApiService: ItemApiService,
        private _globalService: GlobalService,
        private _dialogRef: MatDialogRef<ItemUpdateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {item: ItemModel}
    ) {}

    submit() {
        const form = this.itemForm.form;

        if (form.invalid) {
            form.markAllAsTouched();
            return;
        }
        const data = form.getRawValue();
        this._itemApiService.update(data)
        .subscribe({
            next: (val) => {
                this._globalService.message.next({
                    type: MESSAGE_TYPE.success,
                    message: 'Update successfully!',
                });
                this._dialogRef.close(val);
            },
            error: (err) => {
                // Handle err
                this._globalService.message.next({
                    type: MESSAGE_TYPE.error,
                    message: 'Update error!',
                });
            }
        })
    }
}