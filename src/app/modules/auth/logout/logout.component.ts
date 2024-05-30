import { Component, OnInit, afterNextRender } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-logout",
  template: ``,
  standalone: true,
})
export class LogoutComponent implements OnInit {
  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {
  }

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this._authService.logout();
    this._router.navigate(["/auth", "login"]);
  }
}
