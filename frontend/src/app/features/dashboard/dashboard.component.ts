import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

/*
  Landing page dell'area privata
*/
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-container">
      
      <div class="welcome-header">
        <h2>Benvenuto nel tuo Garage Virtuale</h2>
        <p class="text-muted">Qui puoi avere una panoramica delle tue auto e dei prossimi interventi in autofficina.</p>
      </div>

      <div class="grid-layout">
        
        <div class="dashboard-card">
          <div class="card-icon">🚗</div>
          <h3>I Tuoi Veicoli</h3>
          <p>Hai attualmente <strong>0</strong> veicoli registrati nel sistema.</p>
          <button class="btn-primary" routerLink="/workspace/vehicles">Gestisci Garage</button>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">📅</div>
          <h3>Prossimo Intervento</h3>
          <p>Nessun appuntamento imminente.</p>
          <button class="btn-primary" routerLink="/workspace/appointments">Prenota Ora</button>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">👤</div>
          <h3>Impostazioni Profilo</h3>
          <p>Modifica i tuoi dati personali o gestisci la sicurezza dell'account.</p>
          <button class="btn-secondary" routerLink="/workspace/profile">Modifica Profilo</button>
        </div>

      </div>

      <div class="workshop-info-section">
        <h3>L'Autofficina</h3>
        <div class="info-grid">
          
          <div class="contact-details">
            <p><strong>📍 Indirizzo:</strong> Via dei Motori, 123 - 00100 Roma (RM)</p>
            <p><strong>🕒 Orari:</strong> Lun - Ven: 08:30 - 18:00</p>
            
            <div class="contact-buttons">
              <a href="tel:+390612345678" class="btn-outline">📞 Chiama Subito</a>
              <a href="mailto:info@mycarworkshop.it" class="btn-outline">✉️ Invia Email</a>
            </div>
          </div>

          <div class="map-placeholder">
            <div class="map-mockup">
              <span>Mappa Interattiva Officina</span>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; flex-direction: column; gap: 2rem; }
    .welcome-header h2 { margin-bottom: 0.5rem; color: #333; }
    .text-muted { color: #6c757d; }
    
    .grid-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    
    .dashboard-card { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: flex-start; }
    .card-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .dashboard-card h3 { margin-bottom: 0.5rem; font-size: 1.25rem; }
    .dashboard-card p { margin-bottom: 1.5rem; flex-grow: 1; color: #555; }
    
    .btn-primary { width: 100%; padding: 0.75rem; background: #0056b3; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; text-align: center; text-decoration: none; }
    .btn-secondary { width: 100%; padding: 0.75rem; background: #6c757d; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; text-align: center; text-decoration: none; }
    
    .workshop-info-section { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .workshop-info-section h3 { margin-bottom: 1.5rem; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    
    .contact-details p { margin-bottom: 1rem; font-size: 1.05rem; }
    .contact-buttons { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .btn-outline { padding: 0.6rem 1.2rem; border: 2px solid #0056b3; color: #0056b3; border-radius: 4px; font-weight: bold; text-decoration: none; text-align: center; }
    .btn-outline:hover { background: #0056b3; color: #fff; }
    
    .map-placeholder { width: 100%; height: 200px; background: #e9ecef; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px dashed #adb5bd; }
    .map-mockup { color: #6c757d; font-weight: bold; }

    @media (max-width: 768px) {
      .info-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent {
  // In futuro qui inietteremo i Service per caricare i dati reali
}