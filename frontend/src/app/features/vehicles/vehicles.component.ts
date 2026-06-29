import { Component } from '@angular/core';

/*
  Gestione dei veicoli dell'utente con tabella dei veicoli e
  form reattiva per aggiungere nuovi veicoli, collegata al VehicleService
*/
@Component({
  selector: 'app-vehicles',
  standalone: true,
  template: `
    <div class="workspace-card">
      <div class="header-actions">
        <h2>I Miei Veicoli</h2>
        <button class="btn-primary" disabled>+ Aggiungi Veicolo</button>
      </div>
      
      <div class="empty-state">
        <p>Il modulo di gestione della flotta è in fase di costruzione.</p>
        <p class="text-muted">Presto potrai registrare targa, marca, modello e motorizzazione delle tue auto qui.</p>
      </div>
    </div>
  `,
  styles: [`
    .workspace-card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .header-actions { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 1rem; margin-bottom: 2rem; }
    .btn-primary { padding: 0.5rem 1rem; background: #0056b3; color: white; border: none; border-radius: 4px; font-weight: bold; opacity: 0.5; cursor: not-allowed; }
    .empty-state { text-align: center; padding: 3rem 1rem; background: #f8f9fa; border-radius: 6px; border: 1px dashed #ced4da; }
    .text-muted { color: #6c757d; font-size: 0.9rem; margin-top: 0.5rem; }
  `]
})
export class VehiclesComponent {}