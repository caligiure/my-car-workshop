import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../core/services/booking.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { VehicleDTO } from '../../core/models/vehicle.models';
import { BookingRequestDTO, BookingResponseDTO, InterventionType, DailyAvailabilityDTO } from '../../core/models/booking.models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="workspace-card">
      <div class="tabs">
        <button [class.active]="activeTab() === 'book'" (click)="activeTab.set('book')">Nuova Prenotazione</button>
        <button [class.active]="activeTab() === 'history'" (click)="activeTab.set('history')">Storico Interventi</button>
      </div>

      @if (activeTab() === 'book') {
        <div class="wizard-container">
          
          <div class="steps-indicator">
            <span [class.active]="currentStep() === 1">1. Scegli Veicolo</span>
            <span [class.active]="currentStep() === 2">2. Data e Ora</span>
            <span [class.active]="currentStep() === 3">3. Conferma</span>
          </div>

          @if (errorMessage()) {
            <div class="alert alert-danger">{{ errorMessage() }}</div>
          }

          <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
            
            @if (currentStep() === 1) {
              <div class="step-content">
                <h3>A quale delle tue auto dobbiamo fare la manutenzione?</h3>
                <div class="form-group">
                  <label for="vehicleId">Seleziona Veicolo</label>
                  <select id="vehicleId" formControlName="vehicleId">
                    <option value="" disabled selected>-- Seleziona un veicolo dal tuo garage --</option>
                    @for (v of myVehicles(); track v.id) {
                      <option [value]="v.id">{{ v.brand }} {{ v.model }} ({{ v.licensePlate }})</option>
                    }
                  </select>
                </div>
                @if (myVehicles().length === 0) {
                  <p class="warn-text">⚠️ Non hai veicoli registrati. Vai nella sezione "Veicoli" prima di prenotare.</p>
                }
                <button type="button" class="btn-next" [disabled]="!bookingForm.controls.vehicleId.valid" (click)="currentStep.set(2)">Continua ➡️</button>
              </div>
            }

            @if (currentStep() === 2) {
              <div class="step-content">
                <h3>Quando desideri portare l'auto in officina?</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label for="date">Data Intervento</label>
                    <input id="date" type="date" formControlName="date" (change)="onDateChange()" [min]="minDate">
                  </div>
                  <div class="form-group">
                    <label for="timeSlot">Fascia Oraria</label>
                    <select id="timeSlot" formControlName="timeSlot">
                      <option value="08:30 - 10:30">Mattina (08:30 - 10:30)</option>
                      <option value="10:30 - 12:30">Mattina (10:30 - 12:30)</option>
                      <option value="14:00 - 16:00">Pomeriggio (14:00 - 16:00)</option>
                      <option value="16:00 - 18:00">Pomeriggio (16:00 - 18:00)</option>
                    </select>
                  </div>
                </div>
                <div class="wizard-actions">
                  <button type="button" class="btn-back" (click)="currentStep.set(1)">⬅️ Indietro</button>
                  <button type="button" class="btn-next" [disabled]="!bookingForm.controls.date.valid || !bookingForm.controls.timeSlot.valid" (click)="currentStep.set(3)">Continua ➡️</button>
                </div>
              </div>
            }

            @if (currentStep() === 3) {
              <div class="step-content">
                <h3>Dettagli finali dell'intervento</h3>
                <div class="form-group">
                  <label for="interventionType">Tipo di Intervento</label>
                  <select id="interventionType" formControlName="interventionType">
                    <option value="DIAGNOSTICA">Diagnostica guasti</option>
                    <option value="TAGLIANDO">Tagliando</option>
                    <option value="REVISIONE">Revisione</option>
                    <option value="MANUTENZIONE_STRAORDINARIA">Manutenzione Straordinaria</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="notes">Note o Sintomi del problema</label>
                  <textarea id="notes" formControlName="notes" rows="4" placeholder="Es: Sento un rumore metallico alla ruota anteriore destra in frenata..."></textarea>
                </div>
                <div class="wizard-actions">
                  <button type="button" class="btn-back" [disabled]="isLoading()" (click)="currentStep.set(2)">⬅️ Indietro</button>
                  <button type="submit" class="btn-success" [disabled]="bookingForm.invalid || isLoading()">
                    {{ isLoading() ? 'Sincronizzazione Slot...' : 'Conferma e Prenota Intervento 📅' }}
                  </button>
                </div>
              </div>
            }

          </form>
        </div>
      }

      @if (activeTab() === 'history') {
        <div class="history-container">
          <h3>Il tuo Diario di Bordo digitale</h3>
          @if (historyLoading()) {
            <p>Caricamento dello storico in corso...</p>
          } @else if (myBookings().length === 0) {
            <div class="empty-state">
              <p>Non hai ancora effettuato nessuna prenotazione.</p>
            </div>
          } @else {
            <table class="enterprise-table">
              <thead>
                <tr>
                  <th>Data / Ora</th>
                  <th>Veicolo</th>
                  <th>Intervento</th>
                  <th>Note Tecniche</th>
                  <th>Stato</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                @for (b of myBookings(); track b.id) {
                  <tr>
                    <td><strong>{{ b.date }}</strong><br><small>{{ b.timeSlot }}</small></td>
                    <td>{{ b.vehicleBrand }} {{ b.vehicleModel }}<br><small class="text-muted">{{ b.vehicleLicensePlate }}</small></td>
                    <td><span class="type-badge">{{ b.interventionType }}</span></td>
                    <td><p class="table-notes">{{ b.notes || 'Nessuna nota aggiuntiva' }}</p></td>
                    <td><span class="status-badge" [class.requested]="b.status === 'RICHIESTO'">{{ b.status }}</span></td>
                    <td>@if (b.status === 'RICHIESTO') {<button class="btn-delete" (click)="onDelete(b.id)">Elimina 🗑️</button>}</td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .workspace-card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .tabs { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 2px solid #f1f3f5; }
    .tabs button { padding: 0.75rem 1.5rem; background: none; border: none; font-size: 1rem; font-weight: bold; color: #6c757d; cursor: pointer; }
    .tabs button.active { color: #0056b3; border-bottom: 3px solid #0056b3; }
    
    .steps-indicator { display: flex; justify-content: space-between; margin-bottom: 2.5rem; background: #f8f9fa; padding: 1rem; border-radius: 6px; }
    .steps-indicator span { font-weight: 600; color: #adb5bd; font-size: 0.9rem; }
    .steps-indicator span.active { color: #0056b3; text-decoration: underline; }
    
    .step-content { animation: fadeIn 0.3s ease-in-out; }
    .form-group { display: flex; flex-direction: column; margin-bottom: 1.5rem; }
    .form-group label { font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
    .form-group select, .form-group input, .form-group textarea { padding: 0.6rem; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    
    .wizard-actions { display: flex; justify-content: space-between; margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem; }
    .btn-next, .btn-success { padding: 0.6rem 1.5rem; background: #0056b3; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-left: auto; }
    .btn-success { background: #28a745; }
    .btn-next:disabled, .btn-success:disabled { background: #cccccc; cursor: not-allowed; }
    .btn-back { padding: 0.6rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
    
    .enterprise-table { width: 100%; border-collapse: collapse; margin-top: 1rem; text-align: left; }
    .enterprise-table th, .enterprise-table td { padding: 1rem; border-bottom: 1px solid #dee2e6; }
    .enterprise-table th { background: #f8f9fa; font-weight: bold; }
    .status-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; background: #e2e3e5; }
    .status-badge.pending { background: #fff3cd; color: #856404; }

    .btn-delete {
        background-color: #dc3545; 
        color: white;
        border: none;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.8rem;
        transition: background-color 0.2s;
    }
    .btn-delete:hover { background-color: #c82333; }
    
    .warn-text { color: #dc3545; font-size: 0.85rem; margin-top: 0.5rem; }
    .alert-danger { background: #fdf7f7; color: #d9534f; padding: 0.75rem; border-radius: 4px; border-left: 4px solid #d9534f; margin-bottom: 1rem; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AppointmentsComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private bookingService = inject(BookingService);
  private vehicleService = inject(VehicleService);

  // STATO REATTIVO (SIGNALS)
  activeTab = signal<'book' | 'history'>('book');
  currentStep = signal<number>(1);
  myVehicles = signal<VehicleDTO[]>([]);
  myBookings = signal<BookingResponseDTO[]>([]);
  isLoading = signal<boolean>(false);
  historyLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  monthAvailabilities = signal<DailyAvailabilityDTO[]>([]);

  minDate = new Date().toISOString().split('T')[0];

  // FORM STRUTTURATO SU CAMPI DEL BACKEND
  bookingForm = this.fb.group({
    date: ['', Validators.required],
    timeSlot: ['08:30 - 10:30', Validators.required],
    vehicleId: [null as unknown as number, Validators.required],
    notes: [''],
    interventionType: ['TAGLIANDO' as InterventionType, Validators.required]
  });

  constructor() {
    effect(() => {
      if (this.activeTab() === 'history') {
        this.loadHistory();
      }
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
    // Monitoriamo il cambio di tab per caricare lo storico in modo lazy
    this.bookingForm.valueChanges.subscribe(() => this.errorMessage.set(null));
  }

  loadVehicles(): void {
    this.vehicleService.getMyVehicles().subscribe({
      next: (cars) => this.myVehicles.set(cars),
      error: (error) => {
        this.errorMessage.set('Impossibile caricare il tuo garage virtuale.');
        console.error('Errore durante il caricamento dei veicoli: ' + error.error);
      }
    });
  }

  onDateChange(): void {
    const selectedDate = this.bookingForm.controls.date.value;
    if (!selectedDate) return;

    // Controllo data passata
    if (selectedDate < this.minDate) {
      this.errorMessage.set('Non è possibile prenotare un appuntamento in una data passata.');
      this.bookingForm.controls.date.setValue('');
      console.error('La data elezionata è passata. Dati del giorno selezionato: ', selectedDate);
      return;
    }

    const dateObj = new Date(selectedDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // In JS i mesi partono da 0 (Gennaio = 0)

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Interroghiamo l'endpoint GET /api/bookings/availability che abbiamo appena creato
    this.bookingService.getAvailabilities(year, month).subscribe({
      next: (calendar) => {
        this.isLoading.set(false);
        this.monthAvailabilities.set(calendar);

        // Cerchiamo i dati del giorno specifico selezionato dall'utente
        const dayInfo = calendar.find(d => d.date === selectedDate);

        // Se il giorno è registrato nel DB ed è full (available === false)
        if (dayInfo && !dayInfo.available) {
          const message = `Spiacenti, per la data ${selectedDate} l'officina ha raggiunto la capacità massima di interventi (${dayInfo.currentBookings}/${dayInfo.maxCapacity}). Ti preghiamo di selezionare un altro giorno.`;
          this.errorMessage.set(message);
          alert(message);
          // Svuotiamo fisicamente l'input della data, così il pulsante "Continua" si disabilita
          this.bookingForm.controls.date.setValue('');
          console.log('La data elezionata è piena. Dati del giorno selezionato: ', dayInfo);
        } else {
          // Il giorno è libero! Il form resta valido e l'utente può cliccare su "Continua"
          const occupati = dayInfo ? dayInfo.currentBookings : 0;
          console.log(`Slot confermato! Posti occupati in questa data: ${occupati}`);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Errore di comunicazione col server durante la verifica del calendario.');
        this.bookingForm.controls.date.setValue('');
        console.error('Errore di comunicazione col server durante la verifica del calendario: ' + error.message);
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Il getRawValue genera l'esatto JSON atteso da BookingRequestDTO.java
    const payload: BookingRequestDTO = this.bookingForm.getRawValue();

    this.bookingService.createBooking(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        alert('Prenotazione accettata con successo! L\'officina ha bloccato il tuo slot.');
        this.bookingForm.reset({ timeSlot: '08:30 - 10:30', interventionType: 'TAGLIANDO' });
        this.currentStep.set(1);
        this.activeTab.set('history');
        this.loadHistory();
        console.log('Prenotazione accettata con successo. Slot bloccato per il giorno: ' + payload.date);
      },
      error: (err) => {
        this.isLoading.set(false);
        // Se scatta il 409 Conflict della race condition, l'ErrorInterceptor intercetta l'evento 
        // e questo blocco gestisce il feedback locale.
        this.errorMessage.set(err.error || 'Errore di saturazione o coincidenza di slot.');
        console.error('Errore durante la creazione della prenotazione: ' + err.error);
      }
    });
  }

  loadHistory(): void {
    this.historyLoading.set(true);
    this.bookingService.getMyBookings().subscribe({
      next: (history) => {
        this.myBookings.set(history);
        this.historyLoading.set(false);
        console.log('Storico prenotazioni caricato con successo. Prenotazioni trovate: ' + history.length);
      },
      error: (error) => {
        console.error('Errore durante il caricamento dello storico delle prenotazioni: ' + error.message);
        this.historyLoading.set(false);
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          alert('Prenotazione eliminata con successo e posto ripristinato.');
          console.log('Prenotazione eliminata con successo e posto ripristinato.');
          this.loadHistory(); // Ricarica lo storico aggiornato
        },
        error: (err) => {
          alert(err.error || 'Errore durante l\'eliminazione della prenotazione.');
          console.error('Errore durante l\'eliminazione della prenotazione: ' + err.error);
        }
      });
    }
  }
}