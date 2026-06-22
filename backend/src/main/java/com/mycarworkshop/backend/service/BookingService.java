package com.mycarworkshop.backend.service;

import com.mycarworkshop.backend.model.Appointment;
import com.mycarworkshop.backend.model.DailyAvailability;
import com.mycarworkshop.backend.model.Vehicle;
import com.mycarworkshop.backend.model.enums.AppointmentStatus;
import com.mycarworkshop.backend.model.enums.InterventionType;
// Nota: Assicurati di aver creato queste interfacce Repository
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
    
    // In un'app reale, questo valore verrebbe preso da una tabella "Configurazioni"
    private final Integer CURRENT_WORKSHOP_CAPACITY = 4;

    @Autowired
    public BookingService(DailyAvailabilityRepository dailyRepo, AppointmentRepository appointmentRepo) {
        this.dailyRepo = dailyRepo;
        this.appointmentRepo = appointmentRepo;
    }

    /**
     * Metodo principale per creare la prenotazione.
     * Gestisce la logica di business e l'Optimistic Locking.
     */
    @Transactional
    public Appointment createStandardAppointment(LocalDate date, String timeSlot, Vehicle vehicle, String notes) {
        
        // 1. Recupera o crea il giorno in modo sicuro contro le Race Condition di inserimento
        DailyAvailability daily = getOrCreateDailyAvailability(date);

        // 2. Controllo della capacità massima
        if (daily.getCurrentBookings() >= daily.getMaxCapacity()) {
            throw new IllegalStateException("L'officina ha raggiunto la capacità massima per questa data.");
        }

        // 3. Incremento i contatori. 
        // Se due utenti arrivano qui contemporaneamente, il salvataggio finale 
        // lancerà la OptimisticLockingFailureException per il secondo utente.
        daily.setCurrentBookings(daily.getCurrentBookings() + 1);
        dailyRepo.save(daily);
        
        // 4. Creo e salvo l'appuntamento
        Appointment appointment = new Appointment(
                date, 
                timeSlot, 
                InterventionType.REGULAR_SERVICE, 
                AppointmentStatus.REQUESTED, 
                vehicle, 
                notes
        );
        
        return appointmentRepo.save(appointment);
    }

    /**
     * ISOLAMENTO DELLA TRANSAZIONE (REQUIRES_NEW):
     * Questa annotazione è il trucco da Software Engineer. Crea una mini-transazione
     * separata. Se fallisce per colpa di una Race Condition in inserimento, non
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
                // RACE CONDITION INTERCETTATA!
                // Un altro utente ha creato il giorno una frazione di secondo prima di noi.
                // Nessun problema: ignoriamo l'errore e recuperiamo il giorno appena creato dall'altro utente.
                return dailyRepo.findById(date).orElseThrow(() -> 
                    new IllegalStateException("Errore irreversibile nel recupero della disponibilità.")
                );
            }
        });
    }
}