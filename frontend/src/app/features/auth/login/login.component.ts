import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

/*
  * @description LoginComponent - Componente per la gestione del login dell'utente.
  * Questo componente fornisce un'interfaccia utente per l'inserimento delle credenziali di accesso (email e password).
  * Gestisce la validazione del form, l'invio delle credenziali al servizio di autenticazione e la gestione degli errori.
  * Utilizza Reactive Forms per la gestione del form e segnali per lo stato del componente (loading, errori).
*/
@Component({
  // Selector del componente, utilizzato per il rendering nel template HTML
  selector: 'app-login',
  // Standalone component: non richiede un modulo esterno per essere utilizzato
  standalone: true,
  // ReactiveFormsModule fornisce le funzionalità per la gestione dei form reattivi in Angular
  // RouterLink permette di creare link di navigazione tra le pagine dell'applicazione
  imports: [ReactiveFormsModule, RouterLink],
  // Definizione del template HTML per il componente di login
  template: `
    <div class="login-card">
      <h2>Login</h2>
      <p class="subtitle">Inserisci le tue credenziali per effettuare il login</p>

      @if (errorMessage()) {
        <div class="alert alert-danger" role="alert">
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            type="email" 
            formControlName="email" 
            placeholder="cliente@esempio.it"
            [class.is-invalid]="isFieldInvalid('email')"
          />
          @if (isFieldInvalid('email')) {
            <span class="error-text">Inserisci un indirizzo email valido.</span>
          }
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            type="password" 
            formControlName="password" 
            placeholder="••••••••"
            [class.is-invalid]="isFieldInvalid('password')"
          />
          @if (isFieldInvalid('password')) {
            <span class="error-text">La password è obbligatoria.</span>
          }
        </div>

        <button type="submit" class="btn-primary" [disabled]="loginForm.invalid || isLoading()">
          @if (isLoading()) {
            <span>Verifica in corso...</span>
          } @else {
            <span>Accedi</span>
          }
        </button>

      </form>

      <div class="card-footer">
        <span>Non hai ancora un profilo? </span>
        <a routerLink="/auth/register">Registrati qui</a>
      </div>
    </div>
  `,
  // Definizione degli stili CSS per il componente di login
  styles: [`
    .login-card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .subtitle { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .form-group { display: flex; flex-direction: column; margin-bottom: 1.2rem; }
    label { font-weight: 600; margin-bottom: 0.4rem; font-size: 0.85rem; }
    input { padding: 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
    input.is-invalid { border-color: #d9534f; }
    .error-text { color: #d9534f; font-size: 0.75rem; margin-top: 0.2rem; }
    .alert-danger { background: #fdf7f7; color: #d9534f; padding: 0.75rem; border-radius: 4px; border-left: 4px solid #d9534f; margin-bottom: 1rem; font-size: 0.85rem; }
    .btn-primary { width: 100%; padding: 0.75rem; background: #0056b3; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top: 1rem; }
    .btn-primary:disabled { background: #cccccc; cursor: not-allowed; }
    .card-footer { margin-top: 1.5rem; text-align: center; font-size: 0.85rem; }
  `]
})
export class LoginComponent {
  // Iniezione dei servizi necessari
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // STATO DEL COMPONENTE (Gestito tramite Signals)
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // DEFINIZIONE DEL FORM
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  /**
   * Helper per la UI: verifica se un input è invalido (se l'utente ci ha già interagito (touched))
   */
  isFieldInvalid(fieldName: 'email' | 'password'): boolean {
    const field = this.loginForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  onSubmit(): void {
    // Fail-Fast: Se l'utente ha forzato l'invio con form invalido, stoppiamo l'esecuzione
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Transizione di Stato UI: Attivazione loader e reset errori precedenti
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Chiamata asincrona al servizio di persistenza della sessione
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        console.log('Login effettuato con successo.');
        // Recuperiamo il ruolo dal token
        const role = this.authService.getRole();
        if (role === 'ADMIN') {
          console.log('Login effettuato con successo. Reindirizzamento a: ' + this.router.url);
          this.router.navigate(['/admin/dashboard']);
        } else {
          // Navigazione imperativa verso l'area protetta
          console.log('Login effettuato con successo. Reindirizzamento a: ' + this.router.url);
          this.router.navigate(['/workspace/dashboard']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false); // Spegnimento spinner

        if (err.status === 401 || err.status === 403) {
          this.errorMessage.set('Email o password errati. Riprova.');
        } else {
          this.errorMessage.set('Errore di comunicazione con il server dell\'officina.');
        }
        console.error('Errore durante il login: ' + err.error);
      }
    });
  }
}