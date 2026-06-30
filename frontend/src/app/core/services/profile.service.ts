import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfileDTO, UserProfileUpdateDTO, UserPasswordUpdateDTO } from '../models/profile.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/users/me';

  getProfile(): Observable<UserProfileDTO> {
    return this.http.get<UserProfileDTO>(this.API_URL);
  }

  updateProfile(data: UserProfileUpdateDTO): Observable<UserProfileDTO> {
    return this.http.put<UserProfileDTO>(this.API_URL, data);
  }

  updatePassword(data: UserPasswordUpdateDTO): Observable<string> {
    return this.http.put(this.API_URL + '/password', data, { responseType: 'text' });
  }

  deleteProfile(): Observable<void> {
    return this.http.delete<void>(this.API_URL);
  }
}
