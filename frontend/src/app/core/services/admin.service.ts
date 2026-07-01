import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminAppointmentDTO } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/admin';

  getAppointments(filterTime?: string, email?: string, licensePlate?: string): Observable<AdminAppointmentDTO[]> {
    let params = new HttpParams();
    if (filterTime) params = params.set('filterTime', filterTime);
    if (email) params = params.set('email', email);
    if (licensePlate) params = params.set('licensePlate', licensePlate);

    return this.http.get<AdminAppointmentDTO[]>(`${this.API_URL}/appointments`, { params });
  }

  updateAppointmentStatus(id: number, status: string): Observable<string> {
    return this.http.put(`${this.API_URL}/appointments/${id}/status`, { status }, { responseType: 'text' });
  }
}
