import { Component } from '@angular/core';

@Component({
  selector: 'app-appointments',
  standalone: true,
  template: `
    <div class="workspace-card">
      <h2>Prenotazioni e Storico Interventi</h2>
      
      <div class="tabs-placeholder">
        <div class="tab active">Nuova Prenotazione</div>
        <div class="tab">Storico Interventi</div>
      </div>

      <div class="empty-state">
        <p>Il modulo di prenotazione è in fase di sviluppo.</p>
        <p class="text-muted">In questa sezione implementeremo il calendario di prenotazione per i servizi di manutenzione.</p>
      </div>
    </div>
  `,
  styles: [`
    .workspace-card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .tabs-placeholder { display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid #eee; }
    .tab { padding: 0.5rem 1rem; cursor: not-allowed; color: #6c757d; }
    .tab.active { color: #0056b3; border-bottom: 2px solid #0056b3; font-weight: bold; margin-bottom: -2px; }
    .empty-state { text-align: center; padding: 3rem 1rem; background: #f8f9fa; border-radius: 6px; border: 1px dashed #ced4da; }
    .text-muted { color: #6c757d; font-size: 0.9rem; margin-top: 0.5rem; }
  `]
})
export class AppointmentsComponent {}