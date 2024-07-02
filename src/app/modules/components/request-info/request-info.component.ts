import {Component, Input, numberAttribute} from '@angular/core';
import {ButtonComponent} from "../button/button.component";
import {NgOptimizedImage} from "@angular/common";
import {MatRipple} from "@angular/material/core";

@Component({
  selector: 'app-request-info',
  standalone: true,
  imports: [
    ButtonComponent,
    NgOptimizedImage,
    MatRipple
  ],
  templateUrl: './request-info.component.html',
  styleUrl: './request-info.component.scss'
})
export class RequestInfoComponent {
  @Input() title: string;
  @Input({transform: numberAttribute}) number_of_tickets: number;
}
