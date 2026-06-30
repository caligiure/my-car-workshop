package com.mycarworkshop.backend.service;

import com.mycarworkshop.backend.dto.BookingResponseDTO;
import com.mycarworkshop.backend.dto.DailyAvailabilityDTO;
import com.mycarworkshop.backend.model.Appointment;
import com.mycarworkshop.backend.model.DailyAvailability;
import com.mycarworkshop.backend.model.Vehicle;
import com.mycarworkshop.backend.model.enums.AppointmentStatus;
import com.mycarworkshop.backend.model.enums.InterventionType;
import com.mycarworkshop.backend.repository.AppointmentRepository;
import com.mycarworkshop.backend.repository.DailyAvailabilityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class BookingService {

    private final DailyAvailabilityRepository dailyRepo;
    private final AppointmentRepository appointmentRepo;

    // TO-DO: In un'app reale, questo valore verrebbe preso da una tabella
    // "Configurazioni"
    private final Integer CURRENT_WORKSHOP_CAPACITY = 4;

    // Costruttore con @Autowired per l'iniezione delle dipendenze tramite Spring
    @Autowired
    public BookingService(DailyAvailabilityRepository dailyRepo, AppointmentRepository appointmentRepo) {
        this.dailyRepo = dailyRepo;
        this.appointmentRepo = appointmentRepo;
    }

    /**
     * Metodo principale per creare la prenotazione".
     * Gestisce la logica di business e l'Optimistic Locking.
     * Transactional: garantisce che tutte le operazioni all'interno del metodo
     * siano atomiche.
     */
    @Transactional
    public BookingResponseDTO createAppointment(LocalDate date, String timeSlot, InterventionType interventionType,
            Vehicle vehicle, String notes) {
        // 1. Recupera o crea il giorno in modo sicuro gestendo le Race Condition di
        // inserimento
        DailyAvailability daily = getOrCreateDailyAvailability(date);
        // 2. Se non c'è spazio disponibile, lancia un'eccezione che verrà gestita dal
        // Controller
        if (daily.getCurrentBookings() >= daily.getMaxCapacity()) {
            throw new IllegalStateException("L'officina ha raggiunto la capacità massima per questa data.");
        }
        // 3. Incrementa il contatore dei posti occupati per il giorno selezionato
        daily.setCurrentBookings(daily.getCurrentBookings() + 1);

        // Se due utenti arrivano qui contemporaneamente, il salvataggio finale
        // lancerà la OptimisticLockingFailureException per il secondo utente.
        dailyRepo.save(daily);

        // 4. Crea e salva l'appuntamento
        Appointment appointment = new Appointment(
                date,
                timeSlot,
                interventionType,
                AppointmentStatus.RICHIESTO,
                vehicle,
                notes);

        Appointment savedAppointment = appointmentRepo.save(appointment);

        // MAPPING DA ENTITY A DTO
        BookingResponseDTO responseDTO = new BookingResponseDTO();
        responseDTO.setId(savedAppointment.getId());
        responseDTO.setDate(savedAppointment.getAppointmentDate());
        responseDTO.setTimeSlot(savedAppointment.getTimeSlot());
        responseDTO.setInterventionType(savedAppointment.getInterventionType());
        responseDTO.setNotes(savedAppointment.getUserNotes());
        responseDTO.setVehicleId(savedAppointment.getVehicle().getId());
        responseDTO.setVehicleLicensePlate(savedAppointment.getVehicle().getLicensePlate());
        responseDTO.setVehicleBrand(savedAppointment.getVehicle().getBrand());
        responseDTO.setVehicleModel(savedAppointment.getVehicle().getModel());

        return responseDTO;
    }

    /**
     * ISOLAMENTO DELLA TRANSAZIONE (REQUIRES_NEW):
     * Propagation.REQUIRES_NEW crea una nuova transazione separata e sospende
     * quella corrente.
     * Se la nuova transazione fallisce per colpa di una Race Condition in
     * inserimento, non
     * "avvelena" la transazione principale del metodo chiamante.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public DailyAvailability getOrCreateDailyAvailability(LocalDate date) {
        // Cerca il giorno
        return dailyRepo.findById(date).orElseGet(() -> {
            try {
                // Se non esiste, tenta di crearlo
                DailyAvailability newDaily = new DailyAvailability(date, CURRENT_WORKSHOP_CAPACITY, 0);
                // saveAndFlush forza l'invio della query al DB istantaneamente
                return dailyRepo.saveAndFlush(newDaily);
            } catch (DataIntegrityViolationException e) {
                // RACE CONDITION INTERCETTATA
                // Un altro utente ha creato il giorno una frazione di secondo prima di noi.
                // Soluzione: ignoriamo l'errore e recuperiamo il giorno appena creato
                // dall'altro utente.
                return dailyRepo.findById(date).orElseThrow(
                        () -> new IllegalStateException("Errore irreversibile nel recupero della disponibilità."));
            }
        });
    }

    /**
     * Recupera lo storico delle prenotazioni di un utente specifico filtrato
     * tramite la sua email.
     * Converte le entità in DTO piatti per la trasmissione sicura verso Angular.
     */
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAppointmentsByUserEmail(String email) {
        List<Appointment> appointments = appointmentRepo.findByVehicleOwnerEmail(email);

        return appointments.stream().map(app -> {
            BookingResponseDTO dto = new BookingResponseDTO();
            dto.setId(app.getId());
            dto.setVehicleId(app.getVehicle().getId());
            dto.setDate(app.getAppointmentDate());
            dto.setTimeSlot(app.getTimeSlot());
            dto.setNotes(app.getUserNotes());
            dto.setInterventionType(app.getInterventionType());
            dto.setStatus(app.getStatus());

            // Estraiamo i dati dell'auto evitando la ricorsione sull'owner
            if (app.getVehicle() != null) {
                dto.setVehicleBrand(app.getVehicle().getBrand());
                dto.setVehicleModel(app.getVehicle().getModel());
                dto.setVehicleLicensePlate(app.getVehicle().getLicensePlate());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Genera la mappa di disponibilità per un intero mese.
     * Se un giorno non è presente a DB, viene istanziato dinamicamente come libero.
     */
    @Transactional(readOnly = true)
    public List<DailyAvailabilityDTO> getMonthlyAvailability(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        int length = start.lengthOfMonth();
        LocalDate end = start.withDayOfMonth(length);

        // Preleviamo i giorni modificati presenti nel database per quel mese
        List<DailyAvailability> savedDays = dailyRepo.findByDateBetween(start, end);

        List<DailyAvailabilityDTO> calendar = new ArrayList<>();

        // Cicliamo su tutti i giorni effettivi del mese specifico
        for (int day = 1; day <= length; day++) {
            LocalDate currentDay = LocalDate.of(year, month, day);

            // Verifichiamo se il giorno è presente a DB
            DailyAvailability savedDay = savedDays.stream()
                    .filter(d -> d.getDate().equals(currentDay))
                    .findFirst()
                    .orElse(null);

            DailyAvailabilityDTO dto = new DailyAvailabilityDTO();
            dto.setDate(currentDay);

            if (savedDay != null) {
                dto.setCurrentBookings(savedDay.getCurrentBookings());
                dto.setMaxCapacity(savedDay.getMaxCapacity());
                dto.setAvailable(savedDay.getCurrentBookings() < savedDay.getMaxCapacity());
            } else {
                // Se il record non esiste, il giorno è intonso: 0 prenotazioni e massima
                // capacità
                dto.setCurrentBookings(0);
                dto.setMaxCapacity(CURRENT_WORKSHOP_CAPACITY);
                dto.setAvailable(true);
            }
            calendar.add(dto);
        }

        return calendar;
    }

    @Transactional
    public void deleteAppointment(Long id, String userEmail) {
        // Recupera l'appuntamento
        Appointment appointment = appointmentRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prenotazione non trovata"));
        // Controllo di sicurezza: l'utente loggato deve essere il proprietario
        // dell'auto associata
        if (!appointment.getVehicle().getOwner().getEmail().equals(userEmail)) {
            throw new IllegalStateException("Non sei autorizzato a eliminare questa prenotazione");
        }
        // Ripristina il posto disponibile sul calendario per quella data
        LocalDate date = appointment.getAppointmentDate();
        dailyRepo.findById(date).ifPresent(daily -> {
            if (daily.getCurrentBookings() > 0) {
                daily.setCurrentBookings(daily.getCurrentBookings() - 1);
                dailyRepo.save(daily);
            }
        });
        // Elimina la prenotazione
        appointmentRepo.delete(appointment);
    }
}