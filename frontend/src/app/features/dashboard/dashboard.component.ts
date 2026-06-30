import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { BookingService } from '../../core/services/booking.service';
import { BookingResponseDTO } from '../../core/models/booking.models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
          <p>Hai attualmente <strong>{{ vehicleCount() }}</strong> veicoli registrati nel sistema.</p>
          <button class="btn-primary" routerLink="/workspace/vehicles">Gestisci Garage</button>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">📅</div>
          <h3>Appuntamenti Imminenti</h3>
          @if (isLoadingAppointments()) {
            <p>Caricamento appuntamenti...</p>
          } @else if (upcomingAppointments().length > 0) {
            <ul class="appointment-list">
              @for (app of upcomingAppointments(); track app.id) {
                <li>
                  📅 <strong>{{ app.date }}</strong> alle {{ app.timeSlot }}<br>
                  🚗 {{ app.vehicleBrand }} {{ app.vehicleModel }}<br>
                  🛠️ <span class="type-badge">{{ app.interventionType }}</span>
                </li>
              }
            </ul>
          } @else {
            <p>Nessun appuntamento imminente.</p>
          }          
          <button class="btn-primary" routerLink="/workspace/appointments">Prenota Ora</button>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">👤</div>
          <h3>Impostazioni Profilo</h3>
          <p>Modifica i tuoi dati personali o gestisci l'account.</p>
          <button class="btn-primary" routerLink="/workspace/profile">Modifica Profilo</button>
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

          <div class="map-container">
            <iframe 
              [src]="mapUrl" 
              width="100%" 
              height="200" 
              style="border:0; border-radius: 8px;" 
              allowfullscreen="" 
              loading="lazy">
            </iframe>
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

    .appointment-card { min-width: 280px; }
    .appointment-list { list-style: none; padding: 0; margin: 0 0 1.5rem 0; width: 100%; max-height: 180px; overflow-y: auto; }
    .appointment-list li { padding: 0.6rem 0; border-bottom: 1px solid #f1f3f5; font-size: 0.9rem; color: #495057; line-height: 1.4; }
    .appointment-list li:last-child { border-bottom: none; }
    .type-badge { font-size: 0.75rem; font-weight: bold; background: #e9ecef; padding: 0.2rem 0.4rem; border-radius: 4px; color: #495057; }
    
    .btn-primary { width: 100%; padding: 0.75rem; background: #0056b3; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; text-align: center; text-decoration: none; }
    .btn-secondary { width: 100%; padding: 0.75rem; background: #6c757d; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; text-align: center; text-decoration: none; }
    
    .workshop-info-section { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .workshop-info-section h3 { margin-bottom: 1.5rem; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    
    .contact-details p { margin-bottom: 1rem; font-size: 1.05rem; }
    .contact-buttons { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .btn-outline { padding: 0.6rem 1.2rem; border: 2px solid #0056b3; color: #0056b3; border-radius: 4px; font-weight: bold; text-decoration: none; text-align: center; }
    .btn-outline:hover { background: #0056b3; color: #fff; }
    
    .map-container { width: 100%; height: 200px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #dee2e6; }

    @media (max-width: 768px) {
      .info-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private bookingService = inject(BookingService);
  // sanitizer serve per sanificare i dati sensibili (in questo caso l'url della mappa)
  private sanitizer = inject(DomSanitizer);
  // Stato dei dati
  // i signal sono utilizzati per memorizzare i dati che verranno visualizzati nel template
  // il vantaggio è che quando i dati cambiano, il template viene aggiornato automaticamente
  vehicleCount = signal<number>(0);
  upcomingAppointments = signal<BookingResponseDTO[]>([]);
  isLoadingAppointments = signal<boolean>(true);
  // URL per Google Maps (sanitizzata per iframe)
  mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://maps.google.com/maps?q=Via%20dei%20Motori%20123,%20Roma&t=&z=15&ie=UTF8&iwloc=&output=embed'
  );
  ngOnInit(): void {
    // Carica il numero reale dei veicoli registrati
    this.vehicleService.getMyVehicles().subscribe({
      next: (vehicles) => {
        this.vehicleCount.set(vehicles.length)
        console.log('Veicoli caricati con successo.');
      },
      error: (error) => {
        this.vehicleCount.set(0)
        console.error('Errore durante il caricamento dei veicoli: ' + error.error);
      }
    });
    // Carica la lista degli appuntamenti imminenti (futuri ed attivi)
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        const todayStr = new Date().toISOString().split('T')[0];

        // Filtra solo gli appuntamenti in data odierna o futura e che non sono stati annullati
        const filtered = bookings.filter(b => b.date >= todayStr && b.status !== 'ANNULLATO');

        // Ordina in ordine cronologico crescente (l'appuntamento più vicino per primo)
        filtered.sort((a, b) => a.date.localeCompare(b.date));

        this.upcomingAppointments.set(filtered);
        this.isLoadingAppointments.set(false);
        console.log('Appuntamenti caricati con successo.');
      },
      error: (error) => {
        this.upcomingAppointments.set([]);
        this.isLoadingAppointments.set(false);
        console.error('Errore durante il caricamento degli appuntamenti: ' + error.error);
      }
    });
  }
}