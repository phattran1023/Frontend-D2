import { Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { ItemModel } from "../models/item.model";
import { Observable, map, of } from "rxjs";



@Injectable({
    providedIn: 'root'
})
export class ItemApiService {
    static ITEM = 'item';

    constructor(private _apiService: ApiService) {
    }

    getItems(): Observable<ItemModel[]> {
        //TODO: Call api get item
        // Example
        // return this._apiService.get(ItemApiService.ITEM)
        // .pipe(map(arr => arr.map(val => ItemModel.fromJson(val))));

        // Example mock data
        const mockData = [
            {id: 1, name: 'Coca', quantity: 1, price: 1000},
            {id: 2, name: 'Pepsi', quantity: 10, price: 2000},
            {id: 3, name: '7up', quantity: 10, price: 3000},
        ];
        // Chuyển đổi data json sang classs instance 
        return of(mockData).pipe(map(arr => arr.map(val => ItemModel.fromJson(val))));
    }

    getDetail(data: {id: 1, status: 'active'}): Observable<ItemModel> {
        // TODO: Call api get item detail
        // return this._apiService.get('item/:id', data)
        // Example mock data
        // Chuyển đổi data json sang classs instance 
        return of({id: 1, name: 'Coca', quantity: 1, price: 1000}).pipe(map(data => ItemModel.fromJson(data)))
    }

    create(data: any) {
        //TODO: Call api create
        // return this._apiService.create(url, data);
        // Example
        return of(true);
    }

    update(data: any) {
         //TODO: Call api update
        // return this._apiService.update(url, data);
        // Example
        return of(true);
    }
}