import { Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

/**
 * Controlla che i campi password e conferma password coincidano.
 * Questo validatore di gruppo viene applicato al FormGroup principale del componente RegisterComponent.
 * Se le due password non coincidono, il FormGroup avrà l'errore 'passwordMismatch'.
 * 
 * @note Il validatore è definito come funzione pura e può essere riutilizzato in altri contesti se necessario.
 */
export const matchPasswordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

/*
  Questo componente gestisce la registrazione di un nuovo utente nell'applicazione.
  Utilizza Reactive Forms per la gestione dei campi email, password e conferma password.
  Applica validazioni sia a livello di campo che a livello di gruppo (per la corrispondenza delle password).
  Gestisce lo stato di caricamento e gli eventuali messaggi di errore provenienti dal backend.
*/
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-card">
      <h2>Nuovo Cliente</h2>
      <p class="subtitle">Crea il tuo profilo per registrare i veicoli e prenotare gli interventi</p>

      @if (errorMessage()) {
        <div class="alert alert-danger" role="alert">
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        
        <div class="form-group">
          <label for="email">Indirizzo Email</label>
          <input 
            id="email" 
            type="email" 
            formControlName="email" 
            placeholder="cliente@esempio.it"
            [class.is-invalid]="isFieldInvalid('email')"
          />
          @if (isFieldInvalid('email')) {
            <span class="error-text">Inserisci un indirizzo email formattato correttamente.</span>
          }
        </div>

        <div class="form-group">
          <label for="password">Password di accesso</label>
          <input 
            id="password" 
            type="password" 
            formControlName="password" 
            placeholder="Minimo 6 caratteri"
            [class.is-invalid]="isFieldInvalid('password')"
          />
          @if (isFieldInvalid('password')) {
            <span class="error-text">La password deve contenere almeno 6 caratteri.</span>
          }
        </div>

        <div class="form-group">
          <label for="confirmPassword">Conferma Password</label>
          <input 
            id="confirmPassword" 
            type="password" 
            formControlName="confirmPassword" 
            placeholder="Digita nuovamente la password"
            [class.is-invalid]="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched"
          />
          @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched) {
            <span class="error-text">Le password non coincidono.</span>
          }
        </div>

        <button type="submit" class="btn-primary" [disabled]="registerForm.invalid || isLoading()">
          @if (isLoading()) {
            <span>Generazione profilo in corso...</span>
          } @else {
            <span>Crea Account</span>
          }
        </button>

      </form>

      <div class="card-footer">
        <span>Possiedi già un account? </span>
        <a routerLink="/auth/login">Esegui l'accesso</a>
      </div>
    </div>
  `,
  styles: [`
    .register-card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .subtitle { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .form-group { display: flex; flex-direction: column; margin-bottom: 1.2rem; }
    label { font-weight: 600; margin-bottom: 0.4rem; font-size: 0.85rem; }
    input { padding: 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
    input.is-invalid { border-color: #d9534f; }
    .error-text { color: #d9534f; font-size: 0.75rem; margin-top: 0.2rem; }
    .alert-danger { background: #fdf7f7; color: #d9534f; padding: 0.75rem; border-radius: 4px; border-left: 4px solid #d9534f; margin-bottom: 1rem; font-size: 0.85rem; }
    .btn-primary { width: 100%; padding: 0.75rem; background: #28a745; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top: 1rem; }
    .btn-primary:disabled { background: #cccccc; cursor: not-allowed; }
    .card-footer { margin-top: 1.5rem; text-align: center; font-size: 0.85rem; }
  `]
})
export class RegisterComponent {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Form di registrazione con validatore (conferma password)
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: matchPasswordsValidator });

  isFieldInvalid(fieldName: 'email' | 'password'): boolean {
    const field = this.registerForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Costruzione del DTO atteso dal backend (omettiamo confirmPassword che serve solo alla UI)
    const payload = {
      email: this.registerForm.getRawValue().email,
      password: this.registerForm.getRawValue().password,
      role: 'USER' // Di default un utente registrato dalla web-app pubblica è un cliente standard
    };

    // Chiamata diretta al Controller REST di registrazione definito nel backend
    this.http.post('http://localhost:8080/api/users/register', payload).subscribe({
      next: () => {
        // Registrazione completata con successo: reindirizziamo imperativamente al login
        this.router.navigate(['/auth/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 400 || err.status === 409) {
          this.errorMessage.set('Esiste già un profilo registrato con questo indirizzo email.');
        } else {
          this.errorMessage.set('Errore critico durante la comunicazione con il server di Spring Boot.');
        }
      }
    });
  }
}