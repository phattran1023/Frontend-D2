import {Component, Input} from '@angular/core';

@Component({
  selector: 'dashboard-summary-info',
  standalone: true,
  imports: [],
  templateUrl: './summary-info.component.html',
  styleUrl: './summary-info.component.scss'
})
export class SummaryInfoComponent {
  @Input() title: string;
  @Input() value: string;
  @Input() unit: string;
}
