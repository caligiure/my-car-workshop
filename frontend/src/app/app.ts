import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

// Componente radice dell'applicazione
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrl: './app.scss'
})
export class App {
  // Iniezione delle dipendenze necessarie
  private themeService = inject(ThemeService);

  // Titolo dell'applicazione
  protected readonly title = signal('frontend');
}
