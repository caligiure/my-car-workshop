@echo off
echo ===================================================
echo   AVVIO AMBIENTE DI SVILUPPO - MY CAR WORKSHOP
echo ===================================================

echo.
echo [1/3] Avvio del Database MySQL (Docker)...
docker compose up -d

echo.
echo [2/3] Avvio del Backend Spring Boot...
cd backend
:: Apre una nuova finestra per il backend
start "Backend - Spring Boot" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo.
echo [3/3] Avvio del Frontend Angular...
cd frontend
:: Apre una nuova finestra per il frontend
start "Frontend - Angular" cmd /k "npm start"
cd ..

echo.
echo Tutti i servizi sono in fase di avvio! 
echo Tra pochi secondi potrai aprire il browser all'indirizzo http://localhost:4200
pause