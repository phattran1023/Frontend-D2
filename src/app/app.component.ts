import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MESSAGE_TYPE } from './core/models/message.model';
import { GlobalService } from './core/services/global.service';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SVG_ICONS } from './core/data/custom-svg-icon.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatProgressBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  loading = false;
  
  constructor(
    private readonly _toastr: ToastrService,
    private readonly _globalService: GlobalService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _iconRegistry: MatIconRegistry,
    private readonly _sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
      this._listenMessage();
      this._listenLoader();
      this._addIcons();
  } 

  private _listenMessage() {
    this._globalService.message.subscribe((message) => {
      let msg = '';
      if (message.message) {
          msg = message.message;
      }
      const options = message.options ?? null;
      switch (message.type) {
          case MESSAGE_TYPE.error: {
              this._toastr.error(msg, message.title, message.options);
              break;
          }
          case MESSAGE_TYPE.success: {
              this._toastr.success(msg, message.title, message.options);
              break;
          }
          case MESSAGE_TYPE.warning: {
              this._toastr.warning(msg, message.title, message.options);
              break;
          }
          case MESSAGE_TYPE.info: {
              this._toastr.info(msg, message.title, message.options);
              break;
          }
          default:
              this._toastr.show(msg, message.title, message.options);
      }
    });
  }

  private _listenLoader() {
    this._globalService.loader.status.subscribe(status => {
      this.loading = status;
      this._changeDetectorRef.detectChanges();
    });
  }

  private _addIcons() {
    SVG_ICONS.forEach(item => {
        this._iconRegistry.addSvgIcon(
            item.key,
            this._sanitizer.bypassSecurityTrustResourceUrl(item.path)
        );
    });
}
}
