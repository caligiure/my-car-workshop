package com.mycarworkshop.backend.service;

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

@Service
public class BookingService {

    private final DailyAvailabilityRepository dailyRepo;
    private final AppointmentRepository appointmentRepo;
    
    // TO-DO: In un'app reale, questo valore verrebbe preso da una tabella "Configurazioni"
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
     * Transactional: garantisce che tutte le operazioni all'interno del metodo siano atomiche.
     */
    @Transactional
    public Appointment createAppointment(LocalDate date, String timeSlot, InterventionType interventionType, Vehicle vehicle, String notes) {
        // 1. Recupera o crea il giorno in modo sicuro gestendo le Race Condition di inserimento
        DailyAvailability daily = getOrCreateDailyAvailability(date);
        // 2. Se non c'è spazio disponibile, lancia un'eccezione che verrà gestita dal Controller
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
                AppointmentStatus.REQUESTED, 
                vehicle, 
                notes
        );
        
        return appointmentRepo.save(appointment);
    }

    /**
     * ISOLAMENTO DELLA TRANSAZIONE (REQUIRES_NEW):
     * Propagation.REQUIRES_NEW crea una nuova transazione separata e sospende quella corrente.
     * Se la nuova transazione fallisce per colpa di una Race Condition in inserimento, non
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
                // Soluzione: ignoriamo l'errore e recuperiamo il giorno appena creato dall'altro utente.
                return dailyRepo.findById(date).orElseThrow(() -> 
                    new IllegalStateException("Errore irreversibile nel recupero della disponibilità.")
                );
            }
        });
    }
}