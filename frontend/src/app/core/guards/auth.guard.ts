import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * @description authGuard - Impedisce l'accesso alle rotte protette se l'utente non è autenticato.
 * Intercetta i tentativi di navigazione verso rotte protette e ne ordina la risoluzione
 * solo se lo stato dell'identità utente risulta pienamente valido e non scaduto.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService); // Iniezione del Singleton Service

  // Richiesta dello stato di autenticazione effettivo (decodifica nativa del JWT)
  if (authService.isAuthenticated()) {
    // Principio "Fail-Fast": Se l'utente ha le credenziali, consenti immediatamente l'accesso.
    return true;
  }

  /**
   * Fallback: Se l'utente non è autenticato (se il token è assente, malformato o temporalmente scaduto (exp < now),), 
   * viene reindirizzato al login.
   * Passiamo l'URL originale come parametro di query (returnUrl) per consentire una UX fluida:
   * una volta loggato, l'utente tornerà esattamente dove stava provando ad andare.
   */
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};