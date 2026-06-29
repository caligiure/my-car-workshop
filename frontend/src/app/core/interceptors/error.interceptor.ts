import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * @description Interceptor globale per le eccezioni Http.
 * In particolare intercetta i fallimenti transazionali del backend (REST) e li traduce in comportamenti di navigazione o notifiche UI.
 * Inoltre gestisce la scadenza del token JWT, effettuando il logout dell'utente e reindirizzandolo alla pagina di login.
 * 
 * @note Questo interceptor è registrato globalmente nel modulo CoreModule, quindi viene applicato a tutte le richieste HTTP dell'applicazione.
 * 
 * @note L'interceptor utilizza il servizio AuthService per gestire il logout e il Router per la navigazione.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Gestione Token Scaduto / Non Valido (401 Unauthorized)
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth/login']);
      }

      // GESTIONE RACE CONDITION / OPTIMISTIC LOCKING (409 Conflict)
      // L'utente ha tentato di prenotare uno slot la cui colonna @Version è cambiata un istante prima.
      if (error.status === 409) {
        if (req.url.includes('/appointments') || req.url.includes('/bookings')) {
          console.warn('Conflitto di concorrenza rilevato:', error.error?.message);
          alert('Attenzione: Lo slot selezionato è appena stato occupato da un altro utente. Il calendario verrà aggiornato.');
        }
      }

      // Rilancia l'errore nello stream per permettere ai singoli componenti di spegnere i propri loader spinner
      return throwError(() => error);
    })
  );
};