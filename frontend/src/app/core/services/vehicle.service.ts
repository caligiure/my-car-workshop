import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleDTO } from '../models/vehicle.models';

/*
  Il service VehicleService gestisce le operazioni CRUD relative ai veicoli dell'utente.
  Viene iniettato in DashboardComponent per caricare i veicoli dell'utente.
*/
// provideIn: 'root' => rende il service disponibile in tutta l'applicazione
@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/vehicles';

  getMyVehicles(): Observable<VehicleDTO[]> {
    return this.http.get<VehicleDTO[]>(this.API_URL);
  }

  addVehicle(vehicle: VehicleDTO): Observable<VehicleDTO> {
    return this.http.post<VehicleDTO>(this.API_URL, vehicle);
  }

  updateVehicle(id: number, vehicle: VehicleDTO): Observable<VehicleDTO> {
    return this.http.put<VehicleDTO>(`${this.API_URL}/${id}`, vehicle);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}