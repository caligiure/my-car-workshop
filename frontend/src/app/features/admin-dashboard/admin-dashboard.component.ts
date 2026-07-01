import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { AdminAppointmentDTO } from '../../core/models/admin.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h2>Dashboard Amministratore</h2>
        <p class="text-muted">Gestione centralizzata degli appuntamenti</p>
      </div>

      <!-- SEZIONE FILTRI -->
      <div class="filter-section">
        <form [formGroup]="filterForm" (ngSubmit)="onFilter()">
          <div class="form-row">
            <div class="form-group">
              <label for="filterTime">Periodo</label>
              <select id="filterTime" formControlName="filterTime">
                <option value="">Tutti (Passati e Futuri)</option>
                <option value="future">Solo Futuri</option>
                <option value="past">Solo Passati</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="email">Email Cliente</label>
              <input id="email" type="text" formControlName="email" placeholder="Cerca per email...">
            </div>
            
            <div class="form-group">
              <label for="licensePlate">Targa Veicolo</label>
              <input id="licensePlate" type="text" formControlName="licensePlate" placeholder="Cerca per targa...">
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="isLoading()">Filtra</button>
              <button type="button" class="btn-secondary" (click)="resetFilters()" [disabled]="isLoading()">Reset</button>
            </div>
          </div>
        </form>
      </div>

      @if (errorMessage()) {
        <div class="alert alert-danger">{{ errorMessage() }}</div>
      }
      @if (successMessage()) {
        <div class="alert alert-success">{{ successMessage() }}</div>
      }

      <!-- TABELLA APPUNTAMENTI -->
      <div class="table-container">
        @if (isLoading()) {
          <p>Caricamento appuntamenti in corso...</p>
        } @else if (appointments().length === 0) {
          <p>Nessun appuntamento trovato con i filtri selezionati.</p>
        } @else {
          <table class="enterprise-table">
            <thead>
              <tr>
                <th>Data / Ora</th>
                <th>Cliente</th>
                <th>Veicolo</th>
                <th>Intervento</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              @for (app of appointments(); track app.id) {
                <tr>
                  <td><strong>{{ app.date }}</strong><br><small>{{ app.timeSlot }}</small></td>
                  <td>{{ app.clientName }} {{ app.clientSurname }}<br><small class="text-muted">{{ app.clientEmail }}</small></td>
                  <td>{{ app.vehicleBrand }} {{ app.vehicleModel }}<br><small class="text-muted">{{ app.vehicleLicensePlate }}</small></td>
                  <td><span class="type-badge">{{ app.interventionType }}</span></td>
                  <td>
                    <span class="status-badge" 
                          [class.requested]="app.status === 'RICHIESTO'"
                          [class.confirmed]="app.status === 'CONFERMATO'"
                          [class.completed]="app.status === 'COMPLETATO'"
                          [class.cancelled]="app.status === 'ANNULLATO'">
                      {{ app.status }}
                    </span>
                  </td>
                  <td>
                    <select class="action-select" (change)="onStatusChange(app.id, $event)" [disabled]="isUpdatingId() === app.id">
                      <option value="" disabled selected>Cambia stato...</option>
                      <option value="RICHIESTO" [disabled]="app.status === 'RICHIESTO'">RICHIESTO</option>
                      <option value="CONFERMATO" [disabled]="app.status === 'CONFERMATO'">CONFERMATO</option>
                      <option value="COMPLETATO" [disabled]="app.status === 'COMPLETATO'">COMPLETATO</option>
                      <option value="ANNULLATO" [disabled]="app.status === 'ANNULLATO'">ANNULLATO</option>
                    </select>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-container { display: flex; flex-direction: column; gap: 2rem; max-width: 1200px; margin: 0 auto; }
    .header h2 { margin-bottom: 0.5rem; color: #333; }
    .text-muted { color: #6c757d; }
    
    .filter-section { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .form-row { display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: flex-end; }
    .form-group { display: flex; flex-direction: column; flex-grow: 1; min-width: 200px; }
    .form-group label { font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; color: #555; }
    .form-group input, .form-group select { padding: 0.6rem; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; }
    .form-actions { display: flex; gap: 0.5rem; }
    
    .btn-primary { padding: 0.75rem 1.5rem; background: #0056b3; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
    .btn-primary:hover { background: #004494; }
    .btn-primary:disabled { background: #6c757d; cursor: not-allowed; }
    
    .btn-secondary { padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
    .btn-secondary:hover { background: #5a6268; }
    
    .table-container { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow-x: auto; }
    .enterprise-table { width: 100%; border-collapse: collapse; text-align: left; }
    .enterprise-table th, .enterprise-table td { padding: 1rem; border-bottom: 1px solid #dee2e6; }
    .enterprise-table th { background: #f8f9fa; font-weight: bold; color: #495057; }
    
    .type-badge { font-size: 0.75rem; font-weight: bold; background: #e9ecef; padding: 0.2rem 0.4rem; border-radius: 4px; color: #495057; }
    
    .status-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; color: white; background: #6c757d; }
    .status-badge.requested { background: #17a2b8; }
    .status-badge.confirmed { background: #007bff; }
    .status-badge.completed { background: #28a745; }
    .status-badge.cancelled { background: #dc3545; }
    
    .action-select { padding: 0.4rem; border: 1px solid #ced4da; border-radius: 4px; font-size: 0.85rem; cursor: pointer; }
    
    .alert { padding: 1rem; border-radius: 4px; font-weight: bold; margin-bottom: 1rem; }
    .alert-danger { background: #fdf7f7; color: #d9534f; border-left: 4px solid #d9534f; }
    .alert-success { background: #d4edda; color: #155724; border-left: 4px solid #28a745; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private adminService = inject(AdminService);

  appointments = signal<AdminAppointmentDTO[]>([]);
  isLoading = signal<boolean>(false);
  // isUpdatingId è un indicatore che mi dice se sto aggiornando lo stato di un appuntamento
  isUpdatingId = signal<number | null>(null);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  filterForm = this.fb.group({
    filterTime: [''],
    email: [''],
    licensePlate: ['']
  });

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading.set(true);
    this.clearMessages();

    const { filterTime, email, licensePlate } = this.filterForm.getRawValue();

    this.adminService.getAppointments(filterTime, email, licensePlate).subscribe({
      next: (data) => {
        this.appointments.set(data);
        this.isLoading.set(false);
        console.log('Appuntamenti caricati.');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Errore durante il caricamento degli appuntamenti.');
        console.error(err);
      }
    });
  }

  onFilter(): void {
    this.loadAppointments();
  }

  resetFilters(): void {
    this.filterForm.reset({
      filterTime: '',
      email: '',
      licensePlate: ''
    });
    this.loadAppointments();
  }

  onStatusChange(id: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;
    if (!newStatus) return;

    if (confirm(`Sei sicuro di voler cambiare lo stato in ${newStatus}?`)) {
      this.isUpdatingId.set(id);
      this.clearMessages();

      this.adminService.updateAppointmentStatus(id, newStatus).subscribe({
        next: (msg) => {
          this.isUpdatingId.set(null);
          this.successMessage.set(msg || 'Stato aggiornato con successo.');
          this.loadAppointments(); // Ricarica la lista per mostrare lo stato aggiornato
        },
        error: (err) => {
          this.isUpdatingId.set(null);
          this.errorMessage.set(err.error || 'Errore durante l\'aggiornamento dello stato.');
          console.error('Errore durante l\'aggiornamento dello stato: ' + err.error);
          select.value = ""; // Resetta la select all'opzione di default
        }
      });
    } else {
      select.value = ""; // L'utente ha annullato, resetta la select
    }
  }

  private clearMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}
