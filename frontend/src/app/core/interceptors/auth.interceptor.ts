import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * @description Intercetta le chiamate HTTP in uscita e inietta l'header di autorizzazione.
 * Implementa il pattern 'Decorator' a livello di protocollo di rete.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Iniettiamo il servizio AuthService (definito in core/services) per accedere al token JWT memorizzato nel localStorage.
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Se la chiamata è diretta alla nostra API e possediamo un token, cloniamo la request
  if (token && req.url.startsWith('http://localhost:8080/api')) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // Se è una chiamata pubblica (es. Login o API esterne), procede inalterata
  return next(req);
};