import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatExpansionModule} from '@angular/material/expansion';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {ExpansionPanelComponent, ExpansionPanelItem} from "./expansion-panel/expansion-panel.component";

@Component({
  selector: 'app-slide-bar',
  standalone: true,
  imports: [
    MatIcon,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatExpansionModule,
    ExpansionPanelComponent,
  ],
  templateUrl: './slide-bar.component.html',
  styleUrl: './slide-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideBarComponent {
  readonly panelOpenState = signal(false);
  menuItems:string[] = ["Home", "Product", "Category"];
  subMenuItems:string[] = ["Sub Menu 1", "Sub Menu 2", "Sub Menu 3"];
  expansionPanelItem:ExpansionPanelItem = {
    title: 'Menu Title',
    href: 'http://localhost:4200/layout',
    icon: 'home',
    children: [
      {
        title: 'Item 1',
        href: 'http://localhost:4200/layout',
        icon: 'home',
        children: []
      },
      {
        title: 'Item 2',
        href: 'http://localhost:4200/layout',
        icon: 'home',
        children: []
      }
    ]
  };
}
