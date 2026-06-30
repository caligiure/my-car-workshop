import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingRequestDTO, BookingResponseDTO, DailyAvailabilityDTO } from '../models/booking.models';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private http = inject(HttpClient);
    // URL allineato alla rotta @RequestMapping("/api/bookings") del backend
    private readonly API_URL = 'http://localhost:8080/api/bookings';

    createBooking(payload: BookingRequestDTO): Observable<any> {
        return this.http.post<any>(this.API_URL, payload);
    }

    getAvailabilities(year: number, month: number): Observable<DailyAvailabilityDTO[]> {
        return this.http.get<DailyAvailabilityDTO[]>(`${this.API_URL}/availability`, {
            params: { year, month }
        });
    }

    getMyBookings(): Observable<BookingResponseDTO[]> {
        return this.http.get<BookingResponseDTO[]>(`${this.API_URL}/me`);
    }

    // Observable<void> indica che non ci aspettiamo un corpo dalla risposta (solo lo stato 204)
    deleteBooking(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

}