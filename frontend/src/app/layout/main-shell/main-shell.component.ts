import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

/**
 * @description MainShellComponent - Layout strutturale per l'area autenticata (il Garage Virtuale).
 * Centralizza gli elementi comuni della Dashboard (Sidebar, Header, Pulsante di Logout)
 * riducendo la duplicazione di codice nei componenti di business.
 */
@Component({
  // Selector del componente: 'app-main-shell' indica che questo componente può essere utilizzato 
  // nel template HTML come <app-main-shell></app-main-shell>.
  selector: 'app-main-shell',
  // Standalone specifica che questo componente è standalone, il che significa che non fa parte di un modulo Angular 
  // e può essere utilizzato direttamente senza dover essere dichiarato in un modulo.
  standalone: true,
  // Iniettiamo RouterOutlet per permettere ad Angular di renderizzare i figli (Dashboard/Vehicles/Appointments) al suo interno
  // RouterLink: Gestione della navigazione dichiarativa senza ricaricare la SPA.
  // RouterLinkActive: Applica automaticamente una classe CSS quando la rotta corrente è attiva (feedback visivo immediato).
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  // Definizione del template HTML inline per il componente. 
  // Il template include una sidebar con link di navigazione, 
  // un header e un router-outlet per il rendering dei componenti figli (dashboard, veicoli, appuntamenti).
  template: `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="logo">Opzioni</div>
        <nav>
          <ul>
            @if (isAdmin()) {
              <li>
                <a routerLink="/admin/dashboard" routerLinkActive="active-link" class="admin-link">Area Amministratore</a>
              </li>
            }
            <li>
              <a routerLink="/workspace/dashboard" routerLinkActive="active-link">Area Personale</a>
            </li>
            <li>
              <a routerLink="/workspace/vehicles" routerLinkActive="active-link">I Miei Veicoli</a>
            </li>
            <li>
              <a routerLink="/workspace/appointments" routerLinkActive="active-link">Prenotazioni</a>
            </li>
            <li>
              <a routerLink="/workspace/profile" routerLinkActive="active-link">Profilo</a>
            </li>
            <li>
              <button class="logout-btn" (click)="onLogout()">Logout</button>
            </li>
          </ul>
        </nav>
      </aside>

      <div class="main-workspace">
        <header class="topbar">
          <a routerLink="/" class="home-link">⬅ Home Page</a>
          <h1>My Car Workshop - Officina Online</h1>
          <div class="theme-toggle" (click)="toggleTheme()" [class.dark-active]="themeService.isDarkMode()">
            <span class="icon">{{ themeService.isDarkMode() ? '🌙' : '☀️' }}</span>
          </div>
        </header>
        
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  // Definizione degli stili CSS per il componente. Gli stili sono definiti in-line e applicati solo a questo componente.
  styles: [`
    .app-layout { 
      display: flex; 
      min-height: 100vh; 
      background-image: url('/images/background1.png');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
    }
    .sidebar { width: 250px; display: flex; flex-direction: column; padding: 20px; background: rgba(44, 62, 80, 0.7); backdrop-filter: blur(12px); border-right: 1px solid rgba(255,255,255,0.2); color: white; }
    .logo { font-size: 1.5rem; font-weight: bold; margin-bottom: 2rem; text-align: left; color: #ecf0f1; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
    nav ul { list-style: none; padding: 0; margin: 0; flex: 1; }
    nav li { margin-bottom: 0.5rem; }
    nav a { display: block; padding: 0.75rem 1rem; color: #ecf0f1; text-decoration: none; border-radius: 4px; transition: background 0.2s, color 0.2s; }
    nav a:hover { background: rgba(255, 255, 255, 0.2); color: white; }
    .active-link { background: rgba(0, 86, 179, 0.8); color: white; font-weight: bold; } /* Segnale visivo per il Principio dell'Affordance */
    .admin-link { color: #f39c12; }
    .active-link.admin-link { background: #e67e22; color: white; }
    
    .logout-btn { margin-top: auto; padding: 0.75rem; background: #c0392b; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
    .logout-btn:hover { background: #a53125; }
    
    .main-workspace { flex: 1; display: flex; flex-direction: column; background: transparent; }
    .topbar { height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.2); font-weight: 500; box-shadow: 0 4px 30px rgba(0,0,0,0.1); }
    .topbar h1 { margin: 0; font-size: 1.25rem; color: white; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
    .home-link { text-decoration: none; font-weight: bold; color: white; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); padding: 0.5rem 1rem; border-radius: 4px; transition: background 0.2s; }
    .home-link:hover { background: rgba(255, 255, 255, 0.2); }
    .content { padding: 20px; flex: 1; overflow-y: auto; }
    
    .theme-toggle { cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: #e9ecef; transition: background 0.3s; }
    .theme-toggle:hover { background: #dee2e6; }
    .theme-toggle.dark-active { background: #34495e; }
  `]
})
export class MainShellComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  public themeService = inject(ThemeService);

  isAdmin = signal<boolean>(false);

  ngOnInit(): void {
    this.isAdmin.set(this.authService.getRole() === 'ADMIN');
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * @description Pulisce lo stato di autenticazione e invalida la sessione.
   * Dal punto di vista architetturale, l'azione di logout distrugge l'identità lato client
   * e forza il reindirizzamento immediato, attivando retroattivamente la protezione della guardia.
   */
  onLogout(): void {
    this.authService.logout();
    // Reindirizzamento esplicito all'area pubblica
    this.router.navigate(['/auth/login']);
  }
}