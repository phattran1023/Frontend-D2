import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VerticalNavigationComponent } from '../../vertical-navigation.component';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NavigationItem } from '../../vertical-navigation.types';
import { NavigationService } from '../../vertical-navigation.service';

@Component({
  selector: 'vertical-navigation-basic-item',
  templateUrl: './basic.component.html',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatIconModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    TitleCasePipe
  ]
})
export class VerticalNavigationBasicItemComponent implements OnInit, OnDestroy {
  @Input()
  item!: NavigationItem;
  @Input()
  name!: string;

  private verticalNavigationComponent!: VerticalNavigationComponent;
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  /**
   * Constructor
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _navigationService: NavigationService,
    public titleCasePipe:TitleCasePipe) {
    // Set the equivalent of {exact: false} as default for active match options.
    // We are not assigning the item.isActiveMatchOptions directly to the
    // [routerLinkActiveOptions] because if it's "undefined" initially, the router
    // will throw an error and stop working.
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the parent navigation component
    this.verticalNavigationComponent = this._navigationService.getComponent(this.name);

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Subscribe to onRefreshed on the navigation component
    this.verticalNavigationComponent.onRefreshed.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
