import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// Assumiamo l'esistenza di un AuthService che gestisce lo stato del JWT
// import { AuthService } from '../services/auth.service'; 

/**
 * @description authGuard - Impedisce l'accesso alle rotte protette se l'utente non è autenticato.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // const authService = inject(AuthService); // Dependency Injection funzionale

  // Temporaneamente usiamo un flag mockato. Successivamente leggerà dal Service o dal localStorage/cookie.
  const isAuthenticated = !!localStorage.getItem('access_token');

  if (isAuthenticated) {
    // Principio "Fail-Fast": Se l'utente ha le credenziali, consenti immediatamente l'accesso.
    return true;
  }

  /**
   * Fallback: Se l'utente non è autenticato, viene reindirizzato al login.
   * Passiamo l'URL originale come parametro di query (returnUrl) per consentire una UX fluida:
   * una volta loggato, l'utente tornerà esattamente dove stava provando ad andare.
   */
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};