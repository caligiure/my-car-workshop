import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
        <div class="logo">Officina Online</div>
        <nav>
          <ul>
            <li>
              <a routerLink="dashboard" routerLinkActive="active-link">Dashboard</a>
            </li>
            <li>
              <a routerLink="vehicles" routerLinkActive="active-link">I Miei Veicoli</a>
            </li>
            <li>
              <a routerLink="appointments" routerLinkActive="active-link">Prenotazioni</a>
            </li>
          </ul>
        </nav>
        <button class="logout-btn" (click)="onLogout()">Logout</button>
      </aside>

      <div class="main-workspace">
        <header class="topbar">
          <span>Pannello Utente</span>
        </header>
        
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  // Definizione degli stili CSS per il componente. Gli stili sono definiti in-line e applicati solo a questo componente.
  styles: [`
    .app-layout { display: flex; min-height: 100vh; }
    .sidebar { width: 250px; display: flex; flex-direction: column; padding: 20px; }
    .main-workspace { flex: 1; display: flex; flex-direction: column; }
    .topbar { height: 60px; display: flex; align-items: center; padding: 0 20px; }
    .content { padding: 20px; flex: 1; }
    .active-link { font-weight: bold; } /* Segnale visivo per il Principio dell'Affordance */
  `]
})
// Definizione della classe TypeScript per il componente MainShellComponent. 
// Contiene la logica per gestire il logout dell'utente.
export class MainShellComponent {
  private router = inject(Router);

  /**
   * @description Pulisce lo stato di autenticazione e invalida la sessione.
   * Dal punto di vista architetturale, l'azione di logout distrugge l'identità lato client
   * e forza il reindirizzamento immediato, attivando retroattivamente la protezione della guardia.
   */
  onLogout(): void {
    localStorage.removeItem('access_token');
    // Reindirizzamento esplicito all'area pubblica
    this.router.navigate(['/auth/login']);
  }
}