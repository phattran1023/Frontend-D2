import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  private _componentRegistry: Map<string, any> = new Map<string, any>();

  /**
   * Register navigation component
   *
   * @param name
   * @param component
   */
  registerComponent(name: string, component: any): void {
    this._componentRegistry.set(name, component);
  }

  /**
   * Deregister navigation component
   *
   * @param name
   */
  deregisterComponent(name: string): void {
    this._componentRegistry.delete(name);
  }

  /**
   * Get navigation component from the registry
   *
   * @param name
   */
  getComponent<T>(name: string): T {
    return this._componentRegistry.get(name);
  }
}
