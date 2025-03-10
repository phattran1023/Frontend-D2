import {Component, Input, OnInit, signal} from '@angular/core';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-expansion-panel',
  standalone: true,
    imports: [
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatIcon
    ],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss'
})
export class ExpansionPanelComponent implements OnInit {
  readonly panelOpenState = signal(false);
  Items:ExpansionPanelItem;
  @Input() expansionPanelItem!: ExpansionPanelItem;
  constructor() {
    this.Items = this.expansionPanelItem;
  }
  ngOnInit() {
    this.Items = this.expansionPanelItem;
  }
}

export interface ExpansionPanelItem {
    title: string;
    href: string;
    icon: string;
    children: ExpansionPanelItem[];
}
