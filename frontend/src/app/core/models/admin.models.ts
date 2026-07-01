export interface AdminAppointmentDTO {
  id: number;
  date: string;
  timeSlot: string;
  notes: string;
  interventionType: string;
  status: string;
  
  // Dati Cliente
  clientEmail: string;
  clientName: string;
  clientSurname: string;
  
  // Dati Veicolo
  vehicleBrand: string;
  vehicleModel: string;
  vehicleLicensePlate: string;
}
