import { Expose } from "class-transformer";
import { BaseModel } from "../../core/models/base.model";
import { Default } from "../../core/decorators/default.decorator";
import 'reflect-metadata';


export class ItemModel extends BaseModel {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    @Default(0)
    quantity: number;

    @Expose()
    @Default(0)
    price: number;
}