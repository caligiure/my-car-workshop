import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { ReviewService, ReviewDTO } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="home-container">
      
      <!-- Topbar / Header -->
      <header class="home-header">
        <div class="logo">Officina Online</div>
        <div class="header-actions">
          <div class="theme-toggle" (click)="themeService.toggleTheme()" [class.dark-active]="themeService.isDarkMode()">
            <span class="icon">{{ themeService.isDarkMode() ? '🌙' : '☀️' }}</span>
          </div>
          <a [routerLink]="authService.isAuthenticated() ? '/workspace/dashboard' : '/auth/login'" class="btn-primary login-btn">
            {{ authService.isAuthenticated() ? 'Area Personale' : 'Accedi' }}
          </a>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero-section">
        <h1>My Car Workshop - Officina Online</h1>
        <p class="subtitle">Prenota il tuo intervento in pochi clic. <br> Trasparenza, efficienza e passione per i motori.</p>
      </section>

      <!-- Galleria Immagini -->
      <section class="gallery-section">
        <div class="image-card">
          <img src="/images/esterno_officina.png" alt="Esterno Officina" />
          <div class="image-overlay">Il nostro centro specializzato</div>
        </div>
        <div class="image-card">
          <img src="/images/interno_officina.png" alt="Interno Officina" />
          <div class="image-overlay">Strumentazione all'avanguardia</div>
        </div>
        <div class="image-card">
          <img src="/images/meccanici.png" alt="I nostri tecnici" />
          <div class="image-overlay">I nostri tecnici</div>
        </div>
      </section>

      <!-- Info Officina -->
      <section class="info-section">
        <h2>Vieni a trovarci</h2>
        <div class="info-grid">
          <div class="contact-details">
            <p><strong>📍 Indirizzo:</strong> Via dei Motoristi, 5, 0100 Roma</p>
            <p><strong>📞 Telefono:</strong> +39 06 1234 5678</p>
            <p><strong>✉️ Email:</strong> info&#64;mycarworkshop.it</p>
            <p><strong>🕒 Orari:</strong> Lun - Ven: 08:30 - 18:00</p>
          </div>
          
          <div class="map-container">
            <iframe class="gmap_iframe" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=600&amp;height=200&amp;hl=en&amp;q=via dei motoristi roma&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
          </div>
        </div>
      </section>

      <!-- Recensioni -->
      <section class="reviews-section">
        <h2>Dicono di noi</h2>
        
        <div class="reviews-layout">          <!-- Lista Recensioni -->
          <div class="reviews-list">
            @if (reviews().length === 0) {
              <p class="text-muted">Nessuna recensione presente. Sii il primo a scriverne una!</p>
            }
            @for (review of reviews(); track review.id) {
              <div class="review-item">
                <div class="review-header">
                  <strong>{{ review.authorName }}</strong>
                  <span class="stars">{{ getStars(review.rating) }}</span>
                </div>
                <div class="review-date">{{ review.createdAt | date:'dd/MM/yyyy HH:mm' }}</div>
                <p class="review-text">"{{ review.comment }}"</p>
              </div>
            }
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--bg-color, #f8f9fa);
      background-image: linear-gradient(135deg, #502c2cff, #3498db);
    }
    
    .home-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    
    .theme-toggle { cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: #e9ecef; transition: background 0.3s; }
    .theme-toggle:hover { background: #dee2e6; }
    .theme-toggle.dark-active { background: #34495e; }
    
    .login-btn { margin-top: auto; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
    .login-btn:hover { background: #0056b3; }
    
    .hero-section {
      text-align: center;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #2c3e50, #3498db);
      color: white;
    }
    
    .hero-section h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .gallery-section {
      display: flex;
      gap: 2rem;
      padding: 3rem 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .image-card {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(54, 52, 52, 0.1);
      width: 30%;
      height: 20%;
    }
    
    .image-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    
    .image-card:hover img {
      transform: scale(1.05);
    }
    
    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(50, 114, 151, 0.72);
      color: white;
      padding: 1rem;
      font-weight: bold;
      text-align: center;
    }
    
    .info-section {
      padding: 3rem 2rem;
      max-width: 90%;
      margin: 0 auto;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5) !important;
      border-color: #333 !important;
      background-image: linear-gradient(135deg, #2c3e50, #3498db);
      color: #e0e0e0 !important;
    }
    
    .info-section h2 { margin-bottom: 1.5rem; color: #e0e0e0; }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;
      text-align: left;
    }
    
    @media (max-width: 768px) {
      .info-grid { grid-template-columns: 1fr; text-align: center; }
    }
    
    .contact-details p { margin-bottom: 0.8rem; font-size: 1.1rem; color: #fff; }
    
    .map-container {
      width: 100%;
      height: 200px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .gmap_iframe {
      width: 100% !important;
      height: 100% !important;
    }
    
    .reviews-section {
      padding: 3rem 2rem;
      background: #eee;
    }
    
    .reviews-section h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }
    
    .reviews-layout {
      display: flex;
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
      flex-wrap: wrap;
    }
    
    .reviews-list {
      flex: 1;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 500px;
      overflow-y: auto;
    }
    
    .review-item {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .review-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .stars { color: #f39c12; letter-spacing: 2px; }
    .review-date { font-size: 0.8rem; color: #888; margin-bottom: 0.5rem; }
    .review-text { font-style: italic; color: #555; line-height: 1.4; }
  `]
})
export class HomeComponent implements OnInit {
  public themeService = inject(ThemeService);
  public authService = inject(AuthService);
  private reviewService = inject(ReviewService);

  reviews = signal<ReviewDTO[]>([]);

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviews().subscribe({
      next: (data) => this.reviews.set(data),
      error: (err) => console.error('Errore nel caricamento delle recensioni', err)
    });
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
