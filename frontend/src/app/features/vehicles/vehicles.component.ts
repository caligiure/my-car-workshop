import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../core/services/vehicle.service';
import { VehicleDTO } from '../../core/models/vehicle.models';
import { HttpErrorResponse } from '@angular/common/http';

/*
  Componente che gestisce l'elenco dei veicoli dell'utente.
  Permette di visualizzare, aggiungere, modificare ed eliminare veicoli.
  Utilizza VehicleService per le operazioni CRUD.
*/
@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="workspace-card">
      <div class="header-actions">
        <h2>I Miei Veicoli</h2>
        <button class="btn-primary" (click)="toggleForm()">
          {{ isFormOpen() ? 'Annulla' : '+ Aggiungi Veicolo' }}
        </button>
      </div>

      @if (errorMessage()) {
        <div class="alert alert-danger">{{ errorMessage() }}</div>
      }

      @if (isFormOpen()) {
        <div class="form-container">
          <h3>{{ editingVehicleId() ? 'Modifica Veicolo' : 'Nuovo Veicolo' }}</h3>
          <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <div class="form-group">
                <label>Marca</label>
                <input type="text" formControlName="brand" placeholder="Es. Fiat">
              </div>
              <div class="form-group">
                <label>Modello</label>
                <input type="text" formControlName="model" placeholder="Es. Panda">
              </div>
              <div class="form-group">
                <label>Targa</label>
                <input type="text" formControlName="licensePlate" placeholder="Es. AB123CD">
              </div>
              <div class="form-group">
                <label>Anno</label>
                <input type="number" formControlName="productionYear" placeholder="Es. 2019">
              </div>
              <div class="form-group">
                <label>Motorizzazione</label>
                <input type="text" formControlName="engineType" placeholder="Es. Benzina 1.2">
              </div>
            </div>
            <button type="submit" class="btn-success" [disabled]="vehicleForm.invalid || isLoading()">
              {{ isLoading() ? 'Salvataggio...' : 'Salva Veicolo' }}
            </button>
          </form>
        </div>
      }

      @if (isLoading() && vehicles().length === 0) {
        <p>Caricamento del garage in corso...</p>
      } @else if (vehicles().length === 0 && !isFormOpen()) {
        <div class="empty-state">
          <p>Non hai ancora registrato nessun veicolo.</p>
          <p class="text-muted">Clicca su "+ Aggiungi Veicolo" per iniziare.</p>
        </div>
      } @else {
        <div class="vehicles-grid">
          @for (vehicle of vehicles(); track vehicle.id) {
            <div class="vehicle-card">
              <div class="vehicle-info">
                <h4>{{ vehicle.brand }} {{ vehicle.model }}</h4>
                <p><strong>Targa:</strong> {{ vehicle.licensePlate }}</p>
                <p><strong>Anno:</strong> {{ vehicle.productionYear }}</p>
                <p><strong>Motore:</strong> {{ vehicle.engineType }}</p>
              </div>
              <div class="vehicle-actions">
                <button class="btn-outline" (click)="editVehicle(vehicle)">Modifica</button>
                <button class="btn-danger" (click)="deleteVehicle(vehicle.id!)">Elimina</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .workspace-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.4); }
    .header-actions { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 1rem; margin-bottom: 2rem; }
    .btn-primary { padding: 0.5rem 1rem; background: #0056b3; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
    .btn-success { padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top: 1rem; }
    .btn-success:disabled { background: #cccccc; cursor: not-allowed; }
    .btn-outline { padding: 0.4rem 0.8rem; border: 1px solid #0056b3; color: #0056b3; background: transparent; border-radius: 4px; cursor: pointer; }
    .btn-danger { padding: 0.4rem 0.8rem; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 0.5rem; }
    
    .form-container { background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(5px); padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.6); }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .form-group { display: flex; flex-direction: column; }
    .form-group label { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem; }
    .form-group input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    
    .empty-state { text-align: center; padding: 3rem 1rem; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(5px); border-radius: 6px; border: 1px dashed rgba(0,0,0,0.2); }
    .text-muted { color: #6c757d; font-size: 0.9rem; margin-top: 0.5rem; }
    .alert-danger { background: #fdf7f7; color: #d9534f; padding: 0.75rem; border-radius: 4px; border-left: 4px solid #d9534f; margin-bottom: 1rem; }
    
    .vehicles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .vehicle-card { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.6); border-radius: 6px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; }
    .vehicle-info h4 { margin-top: 0; margin-bottom: 1rem; color: #333; }
    .vehicle-info p { margin: 0.3rem 0; font-size: 0.9rem; color: #555; }
    .vehicle-actions { margin-top: 1.5rem; display: flex; justify-content: flex-end; border-top: 1px solid #eee; padding-top: 1rem; }
  `]
})
export class VehiclesComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private vehicleService = inject(VehicleService);

  // STATO REATTIVO
  vehicles = signal<VehicleDTO[]>([]);
  isLoading = signal<boolean>(false);
  isFormOpen = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  editingVehicleId = signal<number | null>(null);

  // FORM
  vehicleForm = this.fb.group({
    licensePlate: ['', [Validators.required, Validators.minLength(5)]],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    productionYear: [new Date().getFullYear(), [Validators.required, Validators.min(1950)]],
    engineType: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoading.set(true);
    this.vehicleService.getMyVehicles().subscribe({
      next: (data) => {
        this.vehicles.set(data);
        this.isLoading.set(false);
        console.log('Veicoli caricati con successo.');
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set('Errore durante il caricamento dei veicoli.');
        this.isLoading.set(false);
        console.error('Errore durante il caricamento dei veicoli: ' + err.error);
      }
    });
  }

  toggleForm(): void {
    this.isFormOpen.set(!this.isFormOpen());
    if (!this.isFormOpen()) {
      this.resetForm();
    }
  }

  editVehicle(vehicle: VehicleDTO): void {
    this.editingVehicleId.set(vehicle.id!);
    this.vehicleForm.patchValue(vehicle);
    this.isFormOpen.set(true);
    this.errorMessage.set(null);
    console.log('Modifica veicolo...');
  }

  deleteVehicle(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questo veicolo dal tuo garage?')) {
      this.isLoading.set(true);
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          // Aggiornamento ottimistico della UI
          this.vehicles.update(list => list.filter(v => v.id !== id));
          this.isLoading.set(false);
          console.log('Veicolo eliminato con successo.');
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage.set('Impossibile eliminare il veicolo.');
          this.isLoading.set(false);
          console.error('Errore durante l\'eliminazione del veicolo: ' + err.error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const payload = this.vehicleForm.getRawValue();

    if (this.editingVehicleId()) {
      // Flusso di Modifica (PUT)
      this.vehicleService.updateVehicle(this.editingVehicleId()!, payload).subscribe({
        next: () => {
          this.loadVehicles(); // Ricarica la lista aggiornata
          this.toggleForm();
          console.log('Veicolo modificato con successo.');
        },
        error: (err: HttpErrorResponse) => this.handleError(err)
      });
    } else {
      // Flusso di Creazione (POST)
      this.vehicleService.addVehicle(payload).subscribe({
        next: () => {
          this.loadVehicles();
          this.toggleForm();
          console.log('Veicolo aggiunto con successo.');
        },
        error: (err: HttpErrorResponse) => this.handleError(err)
      });
    }
  }

  private handleError(err: HttpErrorResponse): void {
    this.isLoading.set(false);
    this.errorMessage.set(err.status === 400 ? 'Dati del veicolo non validi o targa già esistente.' : 'Errore di comunicazione col server.');
    console.error('Errore durante la gestione del veicolo: ' + err.error);
  }

  private resetForm(): void {
    this.vehicleForm.reset({ productionYear: new Date().getFullYear() });
    this.editingVehicleId.set(null);
    this.errorMessage.set(null);
    console.log('Form resettato.');
  }
}