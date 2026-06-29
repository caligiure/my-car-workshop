import { Component } from '@angular/core';

/*
  Landing page dell'area privata
*/
@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="workspace-card">
      <h2>Benvenuto nel tuo Garage Virtuale</h2>
      <p class="text-muted">Qui potrai gestire i tuoi veicoli e pianificare i prossimi interventi in autofficina.</p>
      
      <div class="status-grid">
        <div class="status-widget">
          <h3>Stato Autenticazione</h3>
          <span class="badge success">Token JWT Valido</span>
          <p>La tua sessione è attiva e sicura.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .workspace-card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .text-muted { color: #6c757d; margin-bottom: 2rem; }
    .status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
    .status-widget { padding: 1.5rem; border: 1px solid #e9ecef; border-radius: 6px; }
    .badge.success { display: inline-block; padding: 0.25rem 0.75rem; background: #d4edda; color: #155724; border-radius: 50px; font-size: 0.85rem; font-weight: bold; margin: 0.5rem 0; }
  `]
})
export class DashboardComponent {}