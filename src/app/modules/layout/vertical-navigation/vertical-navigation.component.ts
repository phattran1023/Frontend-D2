import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationService } from './vertical-navigation.service';
import { NavigationItem, VerticalNavigationMode, VerticalNavigationPosition } from './vertical-navigation.types';
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { VerticalNavigationBasicItemComponent } from './components/basic/basic.component';
import { VerticalNavigationCollapsableItemComponent } from './components/collapsable/collapsable.component';

@Component({
    selector: 'vertical-navigation',
    templateUrl: './vertical-navigation.component.html',
    styleUrls: ['./vertical-navigation.component.scss'],
    standalone: true,
    imports: [CommonModule, MatTooltipModule, MatIconModule, RouterModule, VerticalNavigationBasicItemComponent, VerticalNavigationCollapsableItemComponent],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalNavigationComponent implements OnInit,OnChanges ,AfterViewInit,OnDestroy{
    @Input() autoCollapse  = true;
    @Input() mode: VerticalNavigationMode = 'side';
    @Input() name: string = this.generateId();
    @Input() navigation!: NavigationItem[];
    @Input() opened = true;
    @Input() position: VerticalNavigationPosition = 'left';
    @Input() transparentOverlay = false;
    @Output() readonly modeChanged: EventEmitter<VerticalNavigationMode> = new EventEmitter<VerticalNavigationMode>();
    @Output() readonly openedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() readonly positionChanged: EventEmitter<VerticalNavigationPosition> = new EventEmitter<VerticalNavigationPosition>();
    @ViewChild('navigationContent')
    private navigationContentEl!: ElementRef;

    onCollapsableItemCollapsed: ReplaySubject<NavigationItem> = new ReplaySubject<NavigationItem>(1);
    onCollapsableItemExpanded: ReplaySubject<NavigationItem> = new ReplaySubject<NavigationItem>(1);
    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _animationsEnabled  = false;
    private _asideOverlay!: HTMLElement | null;
    private readonly _handleOverlayClick: any;
    private _hovered  = false;
    private _overlay!: HTMLElement | null;
    private _player!: AnimationPlayer;
    private _scrollStrategy: ScrollStrategy = this._scrollStrategyOptions.block();
    private _unsubscribeAll: Subject<void> = new Subject<void>();
    constructor(
        private _animationBuilder: AnimationBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _renderer2: Renderer2,
        private _router: Router,
        private _scrollStrategyOptions: ScrollStrategyOptions,
        private _navigationService: NavigationService,
    ) {
        this._handleOverlayClick = (): void => {
            this.close();
        };
    }

    private generateId():string {
    return `${ new Date().getTime() }${ Math.floor(Math.random() * Math.floor(1000)) }`;
    }
  // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
     @HostBinding('class') get classList(): any
     {
         return {
             'vertical-navigation-animations-enabled'             : this._animationsEnabled,
             'vertical-navigation-hover'                          : this._hovered,
             'vertical-navigation-mode-over'                      : this.mode === 'over',
             'vertical-navigation-mode-side'                      : this.mode === 'side',
             'vertical-navigation-opened'                         : this.opened,
             'vertical-navigation-position-left'                  : this.position === 'left',
             'vertical-navigation-position-right'                 : this.position === 'right'
         };
     }

     /**
      * Host binding for component inline styles
      */
     @HostBinding('style') get styleList(): any
     {
         return {
             'visibility': this.opened ? 'visible' : 'hidden'
         };
     }

     // -----------------------------------------------------------------------------------------------------
     // @ Decorated methods
     // -----------------------------------------------------------------------------------------------------

     /**
      * On mouseenter
      *
      * @private
      */
     @HostListener('mouseenter')
     private _onMouseenter(): void
     {
         // Enable the animations
         this._enableAnimations();

         // Set the hovered
         this._hovered = true;
     }

     /**
      * On mouseleave
      *
      * @private
      */
     @HostListener('mouseleave')
     private _onMouseleave(): void
     {
         // Enable the animations
         this._enableAnimations();

         // Set the hovered
         this._hovered = false;
     }

     // -----------------------------------------------------------------------------------------------------
     // @ Lifecycle hooks
     // -----------------------------------------------------------------------------------------------------

     /**
      * On changes
      *
      * @param changes
      */
     ngOnChanges(changes: SimpleChanges): void
     {
         // Mode
         if ( 'mode' in changes )
         {
             // Get the previous and current values
             const currentMode = changes['mode'].currentValue;
             const previousMode = changes['mode'].previousValue;

             // Disable the animations
             this._disableAnimations();

             // If the mode changes: 'over -> side'
             if ( previousMode === 'over' && currentMode === 'side' )
             {
                 // Hide the overlay
                 this._hideOverlay();
             }

             // Execute the observable
             this.modeChanged.next(currentMode);

             // Enable the animations after a delay
             // The delay must be bigger than the current transition-duration
             // to make sure nothing will be animated while the mode changing
             setTimeout(() => {
                 this._enableAnimations();
             }, 500);
         }

         // Navigation
         if ( 'navigation' in changes )
         {
             // Mark for check
             this._changeDetectorRef.markForCheck();
         }

         // Opened
         if ( 'opened' in changes )
         {
             // Coerce the value to a boolean
             this.opened = coerceBooleanProperty(changes['opened'].currentValue);

             // Open/close the navigation
             this._toggleOpened(this.opened);
         }

         // Position
         if ( 'position' in changes )
         {
             // Execute the observable
             this.positionChanged.next(changes['position'].currentValue);
         }

         // Transparent overlay
         if ( 'transparentOverlay' in changes )
         {
             // Coerce the value to a boolean
             this.transparentOverlay = coerceBooleanProperty(changes['transparentOverlay'].currentValue);
         }
     }

     /**
      * On init
      */
     ngOnInit(): void
     {
         // Make sure the name input is not an empty string
         if ( this.name === '' )
         {
             this.name = this.generateId();
         }

         // Register the navigation component
         this._navigationService.registerComponent(this.name, this);

         // Subscribe to the 'NavigationEnd' event
         this._router.events
             .pipe(
                 filter(event => event instanceof NavigationEnd),
                 takeUntil(this._unsubscribeAll)
             )
             .subscribe(() => {

                 // If the mode is 'over' and the navigation is opened...
                 if ( this.mode === 'over' && this.opened )
                 {
                     // Close the navigation
                     this.close();
                 }
             });
     }

     /**
      * After view init
      */
     ngAfterViewInit(): void
     {
         setTimeout(() => {

             // Return if 'navigation content' element does not exist
             if ( !this.navigationContentEl )
             {
                 return;
             }

             // If 'navigation content' element doesn't have
             // perfect scrollbar activated on it...
             if ( !this.navigationContentEl.nativeElement.classList.contains('ps') )
             {
                 // Find the active item
                 const activeItem = this.navigationContentEl.nativeElement.querySelector('.vertical-navigation-item-active');

                 // If the active item exists, scroll it into view
                 if ( activeItem )
                 {
                     // activeItem.scrollIntoView();
                 }
             }
         });
     }

     /**
      * On destroy
      */
     ngOnDestroy(): void
     {
         // Forcefully close the navigation and aside in case they are opened
         this.close();

         // Deregister the navigation component from the registry
         this._navigationService.deregisterComponent(this.name);

         // Unsubscribe from all subscriptions
         this._unsubscribeAll.next();
         this._unsubscribeAll.complete();
     }

     // -----------------------------------------------------------------------------------------------------
     // @ Public methods
     // -----------------------------------------------------------------------------------------------------

     /**
      * Refresh the component to apply the changes
      */
     refresh(): void
     {
         // Mark for check
         this._changeDetectorRef.markForCheck();

         // Execute the observable
         this.onRefreshed.next(true);
     }

     /**
      * Open the navigation
      */
     open(): void
     {
         // Return if the navigation is already open
         if ( this.opened )
         {
             return;
         }

         // Set the opened
         this._toggleOpened(true);
     }

     /**
      * Close the navigation
      */
     close(): void
     {
         // Return if the navigation is already closed
         if ( !this.opened )
         {
             return;
         }


         // Set the opened
         this._toggleOpened(false);
     }

     /**
      * Toggle the navigation
      */
     toggle(): void
     {
         // Toggle
         if ( this.opened )
         {
             this.close();
         }
         else
         {
             this.open();
         }
     }

     /**
      * Track by function for ngFor loops
      *
      * @param index
      * @param item
      */
     trackByFn(index: number, item: any): any
     {
         return item.id || index;
     }

     // -----------------------------------------------------------------------------------------------------
     // @ Private methods
     // -----------------------------------------------------------------------------------------------------

     /**
      * Enable the animations
      *
      * @private
      */
     private _enableAnimations(): void
     {
         // Return if the animations are already enabled
         if ( this._animationsEnabled )
         {
             return;
         }

         // Enable the animations
         this._animationsEnabled = true;
     }

     /**
      * Disable the animations
      *
      * @private
      */
     private _disableAnimations(): void
     {
         // Return if the animations are already disabled
         if ( !this._animationsEnabled )
         {
             return;
         }

         // Disable the animations
         this._animationsEnabled = false;
     }

     /**
      * Show the overlay
      *
      * @private
      */
     private _showOverlay(): void
     {
         // Return if there is already an overlay
         if ( this._asideOverlay )
         {
             return;
         }

         // Create the overlay element
         this._overlay = this._renderer2.createElement('div');

         // Add a class to the overlay element
         this._overlay?.classList.add('vertical-navigation-overlay');

         // Add a class depending on the transparentOverlay option
         if ( this.transparentOverlay )
         {
             this._overlay?.classList.add('vertical-navigation-overlay-transparent');
         }

         // Append the overlay to the parent of the navigation
         this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._overlay);

         // Enable block scroll strategy
         this._scrollStrategy.enable();

         // Create the enter animation and attach it to the player
         this._player = this._animationBuilder.build([
             animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({opacity: 1}))
         ]).create(this._overlay);

         // Play the animation
         this._player.play();

         // Add an event listener to the overlay
         this._overlay?.addEventListener('click', this._handleOverlayClick);
     }

     /**
      * Hide the overlay
      *
      * @private
      */
     private _hideOverlay(): void
     {
         if ( !this._overlay )
         {
             return;
         }

         // Create the leave animation and attach it to the player
         this._player = this._animationBuilder.build([
             animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({opacity: 0}))
         ]).create(this._overlay);

         // Play the animation
         this._player.play();

         // Once the animation is done...
         this._player.onDone(() => {

             // If the overlay still exists...
             if ( this._overlay )
             {
                 // Remove the event listener
                 this._overlay.removeEventListener('click', this._handleOverlayClick);

                 // Remove the overlay
                 this._overlay?.parentNode?.removeChild(this._overlay);
                 this._overlay = null;
             }

             // Disable block scroll strategy
             this._scrollStrategy.disable();
         });
     }

     /**
      * Open/close the navigation
      *
      * @param open
      * @private
      */
     private _toggleOpened(open: boolean): void
     {
         // Set the opened
         this.opened = open;

         // Enable the animations
         this._enableAnimations();

         // If the navigation opened, and the mode
         // is 'over', show the overlay
         if ( this.mode === 'over' )
         {
             if ( this.opened )
             {
                 this._showOverlay();
             }
             else
             {
                 this._hideOverlay();
             }
         }

         // Execute the observable
         this.openedChanged.next(open);
     }
}
