package com.mycarworkshop.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Classe Utility per generare, decodificare e validare i token JWT.
 */
@Component
public class JwtUtil {

    // Una chiave segreta che risiede solo sul server. Se qualcuno la scopre, può forgiare token falsi
    // Usiamo @Value per permettere di sovrascriverla da application.properties in produzione.
    @Value("${jwt.secret:MySuperSecretKeyForMyCarWorkshopProjectVerySecure123456}")
    private String secret;

    // Crea una chiave di firma per algoritmo HMAC-SHA utilizzando la chiave segreta
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Estrae il nome utente (email) dal token JWT
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Estrae la data di scadenza dal token JWT
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Estrae un claim specifico dal token JWT. Il claim è una coppia chiave-valore che può contenere informazioni aggiuntive.
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Estrae tutti i claims dal token JWT
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Controlla se il token JWT è scaduto
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Genera un token basato sull'email (username) e inserisce dati extra (l'ID dell'utente)
    public String generateToken(String username, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        return createToken(claims, username);
    }

    // Crea un token JWT con i claims forniti e il soggetto (username)
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Scade in 10 ore
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Valida il token JWT confrontando l'username estratto dal token con quello dell'utente e controllando se il token è scaduto
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}