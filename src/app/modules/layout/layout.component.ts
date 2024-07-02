import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {SlideBarComponent} from "./slide-bar/slide-bar.component";
import {ContentComponent} from "./content/content.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatCardHeader,
    MatCardContent,
    MatIcon,
    MatCardTitle,
    MatCard,
    MatGridList,
    MatGridTile,
    SlideBarComponent,
    ContentComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
