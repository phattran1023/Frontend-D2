import {Component} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCard} from "@angular/material/card";
import {ButtonComponent} from "../components/button/button.component";
import {SummaryInfoComponent} from "../components/summary-info/summary-info.component";
import {RequestInfoComponent} from "../components/request-info/request-info.component";
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {BadgeStatusComponent} from "../components/badge-status/badge-status.component";
import {DatePipe} from "@angular/common";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";


export interface PeriodicElement {
  id: number;
  requested_by: string;
  materials: number;
  stock: number;
  requested_date : Date;
  status: string;
  project: string;
  role: string;
}



const mock_data: PeriodicElement[] = [
  {id: 1, requested_by: "Haha", role:"Engineer", materials: 10, stock:50 , requested_date: new Date(), status: 'Approved', project: 'Project Asssssssssssssssssdsdsd'},
  {id: 2, requested_by: "lmao", role:"Engineer", materials: 20, stock:40, requested_date: new Date(), status: 'Pending', project: 'Project B'},
  {id: 3, requested_by: "Valorant",role:"Engineer", materials: 30, stock:30 ,requested_date: new Date(), status: 'Declined', project: 'Project C'},
  {id: 4, requested_by: "uUu",role:"Engineer", materials: 40, stock:20,requested_date: new Date(), status: 'Approved', project: 'Project D'},
  {id: 5, requested_by: "Hmm",role:"Engineer", materials: 50, stock:88 ,requested_date: new Date(), status: 'Pending', project: 'Project E'},
  {id: 6, requested_by: "Lol",role:"Engineer", materials: 60, stock:322 ,requested_date: new Date(), status: 'Pending', project: 'Project F'},
  {id: 7, requested_by: "CSGO",role:"Engineer", materials: 70, stock:22, requested_date: new Date(), status: 'Pending', project: 'Project G'},
];

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    MatGridTile,
    MatGridList,
    MatCard,
    ButtonComponent,
    SummaryInfoComponent,
    RequestInfoComponent,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    MatIcon,
    MatTable,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatColumnDef,
    BadgeStatusComponent,
    DatePipe,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  displayedColumns: string[] = ['id','requested_by','materials', 'requested_date', 'status','menu'];
  dataSource = mock_data;

}
