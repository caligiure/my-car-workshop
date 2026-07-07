import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/*
  Permette l'accesso al percorso solo se l'utente è autenticato e ha il ruolo di ADMIN.
  La guardia si attiva quando si tenta di accedere a una rotta protetta da questo guard

  CanActivateFn è il tipo di dato che implementa la guardia
  e può essere true, false o un UrlTree che indica la rotta di reindirizzamento

  inject() è dependency injection a livello di funzione (solo per le funzioni, non per le classi)
*/
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.getRole() === 'ADMIN') {
    return true;
  }

  // Se l'utente non è amministratore, reindirizza alla home o al login
  return router.createUrlTree(['/workspace/dashboard']);
};
