export interface VehicleDTO {
  id?: number; // Opzionale perché in fase di creazione (POST) non ce l'abbiamo
  licensePlate: string;
  brand: string;
  model: string;
  productionYear: number;
  engineType: string;
}