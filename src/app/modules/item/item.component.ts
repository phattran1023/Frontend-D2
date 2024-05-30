import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ItemModel } from "../../shared/models/item.model";
import { ItemApiService } from "../../shared/services/item-api.service";
import { Subject, takeUntil } from "rxjs";
import {MatTableModule} from '@angular/material/table';
import { PolicyModule } from "../../core/policy/policy.module";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ItemCreateComponent } from "./item-create/item-create.component";

@Component({
    selector: 'app-item',
    standalone: true,
    imports: [MatButtonModule, MatTableModule, PolicyModule, MatDialogModule],
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
}