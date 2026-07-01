import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

/**
 * @description AuthShellComponent - Layout strutturale per l'area non autenticata.
 * Questo componente rappresenta il contenitore grafico minimale per le pagine di login e registrazione.
 */
// Component indica che questa classe è un componente Angular. 
// Il decoratore @Component fornisce metadati che definiscono come il componente 
// deve essere elaborato, istanziato e utilizzato a runtime.
@Component({
  // Selector del componente: 'app-auth-shell' indica che questo componente può essere utilizzato nel template HTML come <app-auth-shell></app-auth-shell>.
  selector: 'app-auth-shell',
  // Specifica che questo componente è standalone, il che significa che non fa parte di un modulo Angular 
  // e può essere utilizzato direttamente senza dover essere dichiarato in un modulo.
  standalone: true,
  // Iniettiamo RouterOutlet per permettere ad Angular di renderizzare i figli (Login/Register) al suo interno
  imports: [RouterOutlet],
  // Definizione del template HTML per il componente. Il template include un header con il titolo dell'applicazione 
  // e un router-outlet per il rendering dei componenti figli (login, registrazione).
  template: `
    <div class="auth-container">
      <div class="theme-toggle" (click)="themeService.toggleTheme()" [class.dark-active]="themeService.isDarkMode()">
        <span class="icon">{{ themeService.isDarkMode() ? '🌙' : '☀️' }}</span>
      </div>
      <header class="auth-header">
        <h1>My Car Workshop</h1>
      </header>
      
      <main class="auth-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  // Definizione degli stili CSS per il componente. Gli stili sono definiti in-line e applicati solo a questo componente.
  styles: [`
    .auth-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      position: relative;
    }
    .auth-content {
      width: 100%;
      max-width: 400px;
    }
    .theme-toggle {
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e9ecef;
      transition: background 0.3s;
    }
    .theme-toggle:hover { background: #dee2e6; }
    .theme-toggle.dark-active { background: #34495e; }
  `]
})
export class AuthShellComponent {
  public themeService = inject(ThemeService);
}