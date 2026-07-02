import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { BookingService } from '../../core/services/booking.service';
import { BookingResponseDTO } from '../../core/models/booking.models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService, ReviewDTO } from '../../core/services/review.service';
import { ProfileService } from '../../core/services/profile.service';

/*
  Landing page dell'area privata
*/
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
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

      <div class="review-form-card mt-2">
        <h3>Lascia una Recensione</h3>
        <p class="text-muted" style="margin-bottom: 1rem;">La tua opinione è importante per noi e per gli altri clienti.</p>
        <form [formGroup]="reviewForm" (ngSubmit)="onSubmitReview()">
          <div class="form-group">
            <label for="authorName">Il tuo nome</label>
            <input id="authorName" type="text" formControlName="authorName" placeholder="Es. Mario Rossi">
          </div>
          <div class="form-group">
            <label for="rating">Valutazione</label>
            <select id="rating" formControlName="rating">
              <option value="5">⭐⭐⭐⭐⭐ Eccellente</option>
              <option value="4">⭐⭐⭐⭐ Molto buono</option>
              <option value="3">⭐⭐⭐ Buono</option>
              <option value="2">⭐⭐ Sufficiente</option>
              <option value="1">⭐ Scarso</option>
            </select>
          </div>
          <div class="form-group">
            <label for="comment">Opinione</label>
            <textarea id="comment" rows="3" formControlName="comment" placeholder="Scrivi qui la tua opinione su di noi..."></textarea>
          </div>
          
          @if (reviewError()) {
            <div class="error-msg">{{ reviewError() }}</div>
          }
          @if (reviewSuccess()) {
            <div class="success-msg">Grazie per la tua recensione!</div>
          }
          
          <button type="submit" class="btn-primary" [disabled]="reviewForm.invalid || isSubmitting()">
            {{ isSubmitting() ? 'Invio in corso...' : 'Invia recensione' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; flex-direction: column; gap: 2rem; }
    .welcome-header h2 { margin-bottom: 0.5rem; color: white; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
    .text-muted { color: #f8f9fa; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
    
    .grid-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    
    .dashboard-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.4); padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: flex-start; }
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
    
    .review-form-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.4); padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .review-form-card h3 { margin-bottom: 0.5rem; font-size: 1.25rem; }
    .mt-2 { margin-top: 2rem; }
    
    .form-group { display: flex; flex-direction: column; margin-bottom: 1rem; }
    .form-group label { font-weight: bold; font-size: 0.9rem; margin-bottom: 0.4rem; color: #333; }
    .form-group input, .form-group select, .form-group textarea { padding: 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; width: 100%; box-sizing: border-box; }
    
    .error-msg { color: #d9534f; margin-bottom: 1rem; font-size: 0.9rem; }
    .success-msg { color: #28a745; margin-bottom: 1rem; font-size: 0.9rem; font-weight: bold; }
  `]
})
export class DashboardComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private bookingService = inject(BookingService);
  private sanitizer = inject(DomSanitizer);
  private reviewService = inject(ReviewService);
  private profileService = inject(ProfileService);
  private fb = inject(NonNullableFormBuilder);

  vehicleCount = signal<number>(0);
  upcomingAppointments = signal<BookingResponseDTO[]>([]);
  isLoadingAppointments = signal<boolean>(true);

  // Review Form
  isSubmitting = signal<boolean>(false);
  reviewError = signal<string | null>(null);
  reviewSuccess = signal<boolean>(false);

  reviewForm = this.fb.group({
    authorName: ['', Validators.required],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', Validators.required]
  });
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

    // Precompila il nome dell'autore con i dati del profilo
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.reviewForm.patchValue({ authorName: profile.name + ' ' + profile.surname });
      }
    });
  }

  onSubmitReview(): void {
    if (this.reviewForm.invalid) return;

    this.isSubmitting.set(true);
    this.reviewError.set(null);
    this.reviewSuccess.set(false);

    const payload: ReviewDTO = {
      authorName: this.reviewForm.getRawValue().authorName,
      rating: Number(this.reviewForm.getRawValue().rating),
      comment: this.reviewForm.getRawValue().comment
    };

    this.reviewService.createReview(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.reviewSuccess.set(true);
        this.reviewForm.patchValue({ rating: 5, comment: '' }); // keep authorName
        setTimeout(() => this.reviewSuccess.set(false), 3000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.reviewError.set('Errore durante l\'invio della recensione. Riprova.');
        console.error(err);
      }
    });
  }
}