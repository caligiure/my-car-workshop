package com.mycarworkshop.backend.repository;

import com.mycarworkshop.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // JpaRepository fornisce già metodi come save(), findById(), findAll(), deleteById()
    
    // Metodo derivato: Spring scriverà automaticamente la query SQL per cercare un utente tramite email.
    // Ritorna un Optional per evitare NullPointerException se l'utente non esiste.
    Optional<User> findByEmail(String email);
}