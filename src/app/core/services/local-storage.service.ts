import { Injectable, afterNextRender } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  storage: Storage;

  constructor() {
    // Note: Chỗ nào xài LocalStorageService thì phải check xem có storage chưa đã. 
    // Vì build SSR nên khi render xong mới có localStorage
    // vd: auth.service.ts --- function logout()
    afterNextRender(() => {
      this.storage = localStorage;
    })
  }

  get(key: string) {
    try {
      return JSON.parse(this.storage.getItem(key));
    } catch (e) {
        return this.storage.getItem(key);
    }
  }
  set(key: string, value: any) {
    this.storage.setItem(key, value);
  }
  remove(key: string) {
    this.storage.removeItem(key);
  }
  clear() {
    this.storage.clear();
  }
}