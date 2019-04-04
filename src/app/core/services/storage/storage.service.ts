import { Injectable } from '@angular/core';
import { defer, of, timer, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  errorRate: number;
  delay: number;

  constructor() {
    this.config({});
  }

  private async(fn: () => any) {
    return defer(() => timer(this.delay).pipe(
      switchMap(() => Math.random() < this.errorRate
        ? throwError(new Error('Random Error'))
        : of(fn())
      ),
    ));
  }

  config(config: { errorRate?: number, delay?: number }) {
    this.errorRate = config.errorRate !== undefined ? config.errorRate : 0;
    this.delay = config.delay !== undefined ? config.delay : 800;
  }

  get() {
    return this.async(() => {
      const entries = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        entries[key] = JSON.parse(localStorage.getItem(key));
      }
      return entries;
    });
  }
  save(entries: any) {
    return this.async(() => {
      Object.entries(entries)
        .forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)));
      return entries;
    });
  }
  remove(keys: string[]) {
    return this.async(() => {
      keys.forEach(key => localStorage.removeItem(key));
      return keys;
    });
  }
  clear() {
    return this.async(() => {
      localStorage.clear();
      return {};
    });
  }

}
