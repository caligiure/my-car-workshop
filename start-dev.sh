#!/bin/bash

echo "==================================================="
echo "  AVVIO AMBIENTE DI SVILUPPO - MY CAR WORKSHOP"
echo "==================================================="

echo -e "\n[1/3] Avvio del Database MySQL (Docker)..."
sudo docker compose up -d

echo -e "\n[2/3] Avvio del Backend Spring Boot..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

echo -e "\n[3/3] Avvio del Frontend Angular (Premi Ctrl+C per fermare tutto)..."
cd frontend

# Gestione pulita dell'uscita: se fermi Angular, lo script ferma anche Spring Boot
trap "echo -e '\nSpegnimento dei server...'; kill $BACKEND_PID; exit" SIGINT SIGTERM

ng serve