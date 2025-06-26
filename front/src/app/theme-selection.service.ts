import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeSelectionService {
  private selectedThemeSubject = new BehaviorSubject<string | null>(null);
  selectedTheme$ = this.selectedThemeSubject.asObservable();

  setSelectedTheme(theme: string) {
    this.selectedThemeSubject.next(theme);
  }

  clearSelectedTheme() {
    this.selectedThemeSubject.next(null);
  }
} 