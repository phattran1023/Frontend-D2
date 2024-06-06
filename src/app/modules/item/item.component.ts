import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ItemModel } from "../../shared/models/item.model";
import { ItemApiService } from "../../shared/services/item-api.service";
import { Subject, takeUntil } from "rxjs";
import {MatTableModule} from '@angular/material/table';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ItemCreateComponent } from "./item-create/item-create.component";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { ItemUpdateComponent } from "./item-update/item-update.component";
import { PermissionDirective } from "../../core/directives/permission.directive";

@Component({
    selector: 'app-item',
    standalone: true,
    imports: [MatButtonModule, MatTableModule, MatDialogModule, MatIconModule, MatMenuModule, PermissionDirective],
    templateUrl: './item.component.html',
    styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit {
    private _unsubscribeAll: Subject<void> = new Subject<void>();
    displayedColumns: string[] = ['id', 'name', 'quantity', 'price'];
    items: ItemModel[];

    constructor(
        private _itemApiService: ItemApiService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getItems();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getItems() {
        this._itemApiService.getItems()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data => {
            console.log(data)
            this.items = data;
        })
    }

    create() {
        this._dialog.open(ItemCreateComponent, {
            width: '400px',
            disableClose: true
        })
        .afterClosed().subscribe(res => {
            console.log(res)
        })
    }

    update(item: ItemModel) {
        this._dialog.open(ItemUpdateComponent, {
            width: '400px',
            disableClose: true,
            data: {
                item
            }
        })
        .afterClosed().subscribe(res => {
            console.log(res)
        })
    }
}