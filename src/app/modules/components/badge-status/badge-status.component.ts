import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";
function getStatusClass() {
  switch (this.status) {
    case 'Approved':
      return 'border-sky-400';
    case 'Pending':
      return 'border-orange-500';
    case 'Declined':
      return 'border-red-700';
    default:
      return 'bg-gray-500 text-white';
  }
}

function getTextStatusClass() {
  switch (this.status) {
    case 'Approved':
      return 'text-sky-400';
    case 'Pending':
      return 'text-orange-500';
    case 'Declined':
      return 'text-red-700';
    default:
      return 'text-yellow-500';
  }
}
@Component({
  selector: 'app-badge-status',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './badge-status.component.html',
  styleUrl: './badge-status.component.scss'
})
export class BadgeStatusComponent {
  @Input() status: string;
  protected readonly getStatusClass = getStatusClass;
  protected readonly getTextStatusClass = getTextStatusClass;
}
