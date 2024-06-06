import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import moment, { Moment } from "moment";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ItemModel } from "../../../shared/models/item.model";
import { ValidationErrorPipe } from "../../../core/pipe/validation-error.pipe";


export interface IFormGroup {
    name: FormControl<string>;
    quantity: FormControl<number>;
    price: FormControl<number>;
    date: FormControl<Moment>;
}

@Component({
    selector: 'item-form',
    templateUrl: './item-form.component.html',
    styleUrl: './item-form.component.scss',
    standalone: true,
    imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, 
        MatDatepickerModule, ValidationErrorPipe],
})
export class ItemFormComponent implements OnChanges {
    @Input() item: ItemModel;
    form: FormGroup<IFormGroup>;

    constructor(
        private _formBuilder: FormBuilder,
    ) {
        this.form = this.createForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.item) {
            this.form.patchValue(this.item)
        }
    }

    createForm(): FormGroup<IFormGroup> {
        return this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
            quantity: [1, [Validators.required, Validators.min(1)]],
            price: [0, [Validators.required, Validators.max(999999)]],
            date: [moment(), [Validators.required]]
        });
    }
}