import { Component } from '@angular/core';
import {NavigationBarComponent} from "./navigation-bar/navigation-bar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    NavigationBarComponent,
    RouterOutlet
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {

}
