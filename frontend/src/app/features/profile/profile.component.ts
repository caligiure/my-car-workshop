import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <h2>Gestione Profilo</h2>
      
      @if (errorMessage()) {
        <div class="alert alert-danger">{{ errorMessage() }}</div>
      }
      @if (successMessage()) {
        <div class="alert alert-success">{{ successMessage() }}</div>
      }

      <div class="profile-section">
        <h3>Dati Personali</h3>
        <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()">
          <div class="form-group">
            <label for="name">Nome</label>
            <input id="name" type="text" formControlName="name">
          </div>
          <div class="form-group">
            <label for="surname">Cognome</label>
            <input id="surname" type="text" formControlName="surname">
          </div>
          <div class="form-group">
            <label for="email">Email (Non modificabile)</label>
            <input id="email" type="text" formControlName="email">
          </div>
          <button type="submit" class="btn-primary" [disabled]="profileForm.invalid || isLoading()">
            {{ isLoading() ? 'Salvataggio...' : 'Aggiorna Dati Personali' }}
          </button>
        </form>
      </div>

      <div class="profile-section mt-2">
        <h3>Cambia Password</h3>
        <form [formGroup]="passwordForm" (ngSubmit)="onUpdatePassword()">
          <div class="form-group">
            <label for="oldPassword">Vecchia Password</label>
            <input id="oldPassword" type="password" formControlName="oldPassword">
          </div>
          <div class="form-group">
            <label for="newPassword">Nuova Password</label>
            <input id="newPassword" type="password" formControlName="newPassword">
          </div>
          <button type="submit" class="btn-primary" [disabled]="passwordForm.invalid || isPasswordLoading()">
            {{ isPasswordLoading() ? 'Salvataggio...' : 'Aggiorna Password' }}
          </button>
        </form>
      </div>

      <div class="profile-section danger-zone mt-2">
        <h3>Attenzione</h3>
        <p>L'eliminazione dell'account è irreversibile. Tutti i tuoi veicoli e appuntamenti verranno cancellati.</p>
        <button class="btn-danger" (click)="onDeleteProfile()" [disabled]="isDeleteLoading()">
          {{ isDeleteLoading() ? 'Eliminazione...' : 'Elimina Definitivamente Account' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .profile-container { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
    h2 { margin-bottom: 1rem; color: white; border-bottom: 2px solid rgba(255,255,255,0.2); padding-bottom: 0.5rem; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
    
    .profile-section { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.4); }
    .profile-section h3 { margin-bottom: 1.5rem; color: #333; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 0.5rem; }
    
    .danger-zone { border: 2px solid rgba(220, 53, 69, 0.5); background-color: rgba(255, 248, 248, 0.85); }
    .danger-zone h3 { color: #dc3545; border-bottom-color: rgba(220, 53, 69, 0.2); }
    .danger-zone p { color: #721c24; margin-bottom: 1rem; }
    
    .mt-2 { margin-top: 1rem; }
    
    .form-group { display: flex; flex-direction: column; margin-bottom: 1.2rem; }
    .form-group label { font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; color: #333; }
    .form-group input { padding: 0.6rem; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; }
    .form-group input:disabled { background-color: #e9ecef; cursor: not-allowed; }
    
    .btn-primary { padding: 0.75rem 1.5rem; background: #0056b3; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
    .btn-primary:hover { background: #004494; }
    .btn-primary:disabled { background: #6c757d; cursor: not-allowed; }
    
    .btn-danger { padding: 0.75rem 1.5rem; background: #dc3545; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
    .btn-danger:hover { background: #c82333; }
    .btn-danger:disabled { background: #e4606d; cursor: not-allowed; }
    
    .alert { padding: 1rem; border-radius: 4px; font-weight: bold; margin-bottom: 1rem; }
    .alert-danger { background: #fdf7f7; color: #d9534f; border-left: 4px solid #d9534f; }
    .alert-success { background: #d4edda; color: #155724; border-left: 4px solid #28a745; }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  isLoading = signal<boolean>(false);
  isPasswordLoading = signal<boolean>(false);
  isDeleteLoading = signal<boolean>(false);

  profileForm = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: [{ value: '', disabled: true }]
  });

  passwordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
        console.log('Profilo caricato con successo.');
      },
      error: (error) => {
        this.errorMessage.set('Impossibile caricare il profilo.');
        console.error('Errore durante il caricamento del profilo: ' + error.message);
      }
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) return;

    this.isLoading.set(true);
    this.clearMessages();

    const data = {
      name: this.profileForm.controls.name.value,
      surname: this.profileForm.controls.surname.value
    };

    this.profileService.updateProfile(data).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Dati personali aggiornati con successo.');
        console.log('Dati personali aggiornati con successo.');
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Errore durante l\'aggiornamento del profilo.');
        console.error('Errore durante l\'aggiornamento del profilo: ' + error.message);
      }
    });
  }

  onUpdatePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isPasswordLoading.set(true);
    this.clearMessages();

    this.profileService.updatePassword(this.passwordForm.getRawValue()).subscribe({
      next: (msg) => {
        this.isPasswordLoading.set(false);
        this.successMessage.set(msg || 'Password aggiornata con successo.');
        this.passwordForm.reset();
        console.log('Password aggiornata con successo.');
      },
      error: (error) => {
        this.isPasswordLoading.set(false);
        this.errorMessage.set(error.error || 'Errore durante l\'aggiornamento della password.');
        console.error('Errore durante l\'aggiornamento della password: ' + error.message);
      }
    });
  }

  onDeleteProfile(): void {
    if (confirm('ATTENZIONE! Sei sicuro di voler eliminare definitivamente il tuo account? Tutti i tuoi veicoli e appuntamenti andranno persi.')) {
      if (confirm('Sei veramente sicuro? Questa operazione è irreversibile.')) {
        this.isDeleteLoading.set(true);
        this.clearMessages();

        this.profileService.deleteProfile().subscribe({
          next: () => {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            console.log('Profilo eliminato con successo.');
          },
          error: (error) => {
            this.isDeleteLoading.set(false);
            this.errorMessage.set('Errore durante l\'eliminazione dell\'account.');
            console.error('Errore durante l\'eliminazione dell\'account: ' + error.message);
          }
        });
      }
    }
  }

  private clearMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}
