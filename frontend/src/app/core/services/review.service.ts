import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReviewDTO {
  id?: number;
  authorName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  // readonly impedisce la modifica della variabile
  private readonly API_URL = 'http://localhost:8080/api/reviews';

  getReviews(): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(this.API_URL);
  }

  createReview(review: ReviewDTO): Observable<ReviewDTO> {
    return this.http.post<ReviewDTO>(this.API_URL, review);
  }
}
