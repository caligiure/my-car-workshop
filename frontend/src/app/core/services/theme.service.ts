import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly COOKIE_NAME = 'theme';
  public isDarkMode = signal<boolean>(false);

  constructor() {
    // Leggiamo il cookie al caricamento
    const savedTheme = this.getCookie(this.COOKIE_NAME);
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.body.classList.add('dark-theme');
    }

    // Usiamo un effect per reagire automaticamente ai cambiamenti di stato
    effect(() => {
      const dark = this.isDarkMode();
      this.setCookie(this.COOKIE_NAME, dark ? 'dark' : 'light', 365);
      
      if (dark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update(dark => !dark);
  }

  // --- Funzioni Helper per i Cookie nativi ---
  private setCookie(name: string, value: string, days: number): void {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    // Path=/ rende il cookie valido per tutto il dominio
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}
