import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

/**
 * @description Definizione dell'albero di navigazione.
 * Applica il principio della segregazione delle responsabilità) e del Code Splitting: 
 * ogni funzionalità è incapsulata in un modulo separato, caricato in LAZY LOADING solo quando l'utente naviga verso quella funzionalità.
 * Questo approccio migliora le performance dell'applicazione, riducendo il tempo di caricamento iniziale e ottimizzando l'uso della memoria.
 */
export const routes: Routes = [
  {
    path: '', // Rotta di default: reindirizza alla dashboard se l'utente è autenticato, altrimenti al login
    redirectTo: 'workspace',
    pathMatch: 'full'
  },

  // --- AREA PUBBLICA (Autenticazione) ---
  {
    path: 'auth',
    loadComponent: () => import('./layout/auth-shell/auth-shell.component').then(m => m.AuthShellComponent), // Caricamento lazy del componente AuthShellComponent
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
      },
      { 
        path: 'register', 
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) 
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' } // Rotta di fallback per l'area pubblica: se l'utente naviga su /auth senza specificare una sottorotta, viene reindirizzato al login
    ]
  },

  // --- AREA PRIVATA (Garage Virtuale) ---
  {
    path: 'workspace',
    canActivate: [authGuard], // Guardia di sicurezza: impedisce l'accesso alle rotte protette se l'utente non è autenticato, reindirizzandolo al login
    loadComponent: () => import('./layout/main-shell/main-shell.component').then(m => m.MainShellComponent),
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'vehicles', 
        loadComponent: () => import('./features/vehicles/vehicles.component').then(m => m.VehiclesComponent) 
      },
      { 
        path: 'appointments', 
        loadComponent: () => import('./features/appointments/appointments.component').then(m => m.AppointmentsComponent) 
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) 
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Rotta di fallback per l'area privata: se l'utente naviga su /workspace senza specificare una sottorotta, viene reindirizzato alla dashboard
    ]
  },

  // --- AREA AMMINISTRATORE ---
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layout/main-shell/main-shell.component').then(m => m.MainShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // --- ROTTA DI FALLBACK (Wildcard Route) ---
  // Gestione dell'errore di navigazione (404 client-side).
  // Se l'utente digita una rotta inesistente, viene riportato all'area privata (workspace) se autenticato,
  // altrimenti all'area pubblica (login) tramite l'authGuard.
  {
    path: '**',
    redirectTo: 'workspace' 
  }
];