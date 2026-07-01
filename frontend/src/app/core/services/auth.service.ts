import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponseDTO, LoginRequestDTO } from '../models/auth.models';

/**
 * @description Singleton Service (@Injectable root) incaricato della persistenza 
 * della sessione tramite JWT e del colloquio con l'endpoint di sicurezza Spring Boot.
 * La classe AuthService gestisce l'autenticazione dell'utente, inclusi login, logout e verifica dello stato di autenticazione. 
 */
// @Injectable indica che questo servizio è un singleton e può essere iniettato in qualsiasi 
// componente o servizio dell'applicazione Angular. 
// Il token JWT viene memorizzato nel localStorage del browser per la persistenza della sessione.
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Iniettiamo HttpClient per effettuare richieste HTTP al backend Spring Boot.
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/auth';
  // Definiamo una chiave costante per memorizzare il token JWT nel localStorage del browser.
  private readonly TOKEN_KEY = 'access_token';

  /**
   * Esegue l'autenticazione asincrona.
   * Utilizza l'operatore RxJS 'tap' per memorizzare il token come Side-Effect, 
   * cioè un'operazione che viene eseguita al di fuori del normale flusso di dati, 
   * indipendentemente dalla gestione degli errori, 
   * lasciando intatto lo stream reattivo per i componenti che ne effettuano la sottoscrizione.
   */
  login(credentials: LoginRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Decodifica il payload del token JWT per poterne leggere i claims
   */
  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payloadBase64Url = token.split('.')[1];
      if (!payloadBase64Url) return null;
      const base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (error) {
      return null;
    }
  }

  /**
   * Restituisce il ruolo dell'utente dal token JWT
   */
  getRole(): string | null {
    const payload = this.getDecodedToken();
    return payload ? payload.role : null;
  }

  /**
   * @description Controlla l'esistenza del token e ne verifica la validità temporale.
   * Applica il principio Fail-Fast impedendo l'accesso alle rotte protette se la sessione è scaduta.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    return !this.isTokenExpired(token);
  }

  /**
   * @description Decodifica nativamente il payload del JWT e legge il timestamp di scadenza.
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.getDecodedToken();
      if (!payload) return true;

      // Se il backend non ha iniettato il claim 'exp', lo consideriamo valido di default
      if (!payload.exp) {
        return false;
      }

      // Confronto temporale: 'exp' è in secondi, Date.now() restituisce millisecondi
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);

      // Se il tempo attuale ha superato o eguagliato la data di scadenza, il token è morto
      return currentTimestampInSeconds >= payload.exp;

    } catch (error) {
      // Fail-Safe: Se la stringa è malformata o manomessa, neghiamo l'accesso per sicurezza
      console.error('Errore durante la decodifica del token JWT:', error);
      return true;
    }
  }
}