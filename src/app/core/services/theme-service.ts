import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme$ = new BehaviorSubject<ThemeMode>('light');

  constructor() {
    const saved = localStorage.getItem('theme') as ThemeMode;
    this.setTheme(saved === 'dark' ? 'dark' : 'light');
  }

  toggle() {
    const next: ThemeMode = this.theme$.value === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(mode: ThemeMode) {
    this.theme$.next(mode);
    localStorage.setItem('theme', mode);

    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
