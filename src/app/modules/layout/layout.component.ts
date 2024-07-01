import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {ActivatedRoute, RouterModule, RouterOutlet} from "@angular/router";
import {VerticalNavigationComponent} from "./vertical-navigation/vertical-navigation.component";
import {NavigationService} from "./vertical-navigation/vertical-navigation.service";
import {NavigationItem} from "./vertical-navigation/vertical-navigation.types";
import {UserModel} from "../../shared/models/user.model";
import {MatMenuModule} from '@angular/material/menu';
import {PermissionService} from "../../core/services/permission.service";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatIconModule, MatMenuModule, RouterModule, VerticalNavigationComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  user: UserModel;
  navigation: NavigationItem[] = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _navigationService: NavigationService,
    private _permissionService: PermissionService
  ) {
  }

  ngOnInit(): void {
    this._activatedRoute.data.subscribe(data => {
      this.user = data['user'];
    });
    this.navigation = this.getNavigation();
  }

  toggleNavigation(name: string) {
    // Get the navigation
    const navigation =
      this._navigationService.getComponent<VerticalNavigationComponent>(
        name
      );

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }

  getNavigation(): NavigationItem[] {
    return [
      {
        id: "dashboard",
        title: "Dashboard",
        tooltip: 'Dashboard',
        type: "basic",
        icon: "dashboard",
        link: "/dashboard",
      },
      {
        id: "inventory",
        title: "Inventory",
        tooltip: 'Inventory',
        type: "basic",
        icon: "inventory",
        link: "/inventory",
      },
      {
        id: "general",
        title: "General",
        type: "collapsable",
        icon: "analytic",
        isSvgIcon: true,
        hidden: (item) => !item.children.filter(val => !val.hidden || !val.hidden(val)).length, // Nếu những item trong children đều ẩn hết thì sẽ ẩn luôn item này
        children: [{
          id: 'item',
          title: "Item",
          type: 'basic',
          link: "/item",
          hidden: () => !this._permissionService.can('item::read'), // Kiểm tra permission của user để ẩn
        }, {
          id: 'doc',
          title: "Document",
          type: 'basic',
          link: "/doc",
          // hidden: () => !this._permissionService.can('doc::read')
        }],
      },
    ]
  }
}
