// Mappatura speculare dell'enum InterventionType presente nel backend
export type InterventionType = 'DIAGNOSTICS' | 'REGULAR_SERVICE' | 'INSPECTION' | 'EXTRAORDINARY_MAINTENANCE';

// Mappatura perfetta di BookingRequestDTO.java
export interface BookingRequestDTO {
  date: string;           // Formato ISO: YYYY-MM-DD
  timeSlot: string;       // Es: "08:30 - 10:30"
  vehicleId: number;      // ID del veicolo selezionato
  notes: string;          // Descrizione dei sintomi o note
  interventionType: InterventionType;
}

// Struttura sicura per leggere lo storico senza ricorsioni cicliche
export interface BookingResponseDTO {
  id: number;
  date: string;
  timeSlot: string;
  notes: string;
  interventionType: InterventionType;
  status: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleLicensePlate: string;
}

export interface DailyAvailabilityDTO {
  date: string;
  available: boolean;
  currentBookings: number;
  maxCapacity: number;
}