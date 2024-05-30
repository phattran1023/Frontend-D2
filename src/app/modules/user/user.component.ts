import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { UserModel } from "../../shared/models/user.model";
import { GlobalService } from "../../core/services/global.service";
import { AppConstant } from "../../app.constant";

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
    user: UserModel;

    constructor(private _globalService: GlobalService) {
    }

    ngOnInit(): void {
        this._globalService.storage.watch(AppConstant.GLOBAL_STORAGE.USER)
        .subscribe((data: UserModel) => {
            this.user = data;
        })        
    }
}