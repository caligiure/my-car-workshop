package com.mycarworkshop.backend.repository;

import com.mycarworkshop.backend.model.DailyAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyAvailabilityRepository extends JpaRepository<DailyAvailability, LocalDate> {
    // JpaRepository fornisce già metodi come save(), findById(), findAll(),
    // deleteById()
    // Nota: Il tipo di ID qui è LocalDate, perché è la chiave primaria che abbiamo
    // definito nell'entità

    List<DailyAvailability> findByDateBetween(LocalDate start, LocalDate end);
}