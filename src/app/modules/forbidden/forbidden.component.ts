import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-forbidden',
    standalone: true,
    imports: [MatButtonModule, RouterModule],
    templateUrl: './forbidden.component.html',
    styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {
}