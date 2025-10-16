## OMS Architekturentwurf On Prem 

- Frontend 
    NextJS
        page.tsx
        shopping_cart.tsx
- Backend
    NodeJs
    Express
    MongoDB
        server.ts
        mongo.ts

## Next JS app starten 

```bash

cd oms-app

npm run dev

```

## Backend starten

```bash

npm install

npm run dev

```
## Environment Dateien erstellen 

## Beschreibung

- In Frontend wurden mit NextJs Form mit Feldern (Name, Vorname, Adresse, Telefonnummer) und Ware mit Feldern (Preis und        Warenmenge) erstellt. Felder werden in Form mit Attribut pattern validiert.
  Nachdem Form validiert wird, wird Funktion onSubmit aufgerufen und alle Felder nach Backend Server (server.ts) geschickt. 
  Backend Server wird mit NodeJs und Express aufgebaut.
- Backend Server bekommt Anfrage, validiert noch mal Felder mit Funktion validateOrderFields.
- Falls Felder erfolgreich validiert wurden, dann wird Verbindung mit MongoDb aufgebaut, Kunde mit MongoDb erstellt (Funktion createUser) und clientId zurückgeschikt, clientId in diesem Fall habe ist id von MongoDB erstellten Object. Nachdem wird Funktion findProductByName aufgerufen, um productId zu bekommen.
- Am Schluss wird Object mit Feldern (customerId, productId, quantity, price, und shippingAddress) erstellt und nach Frontend 
    zurückgeschickt. Gegebenfalls könnte man Bestellungsbestätigung in Frontend (e-shop) anzeigen bzw. rendern als auch könnte man mit NodeJs package nodemailer E-mail an Kunde schicken.

## Validerung 

- Seitens Frontend in Form mit pattern geprüft
- Seitens Backend in server.ts gepftüft (Funktion validateOrderFields)

## Fehlerbehandlung

- Wird mit try und catch Block in server.ts und in shopping_cart.
- In server.ts wird mit Validierungsfunktion (validateOrderFields) Felder geprüft und in server ts mit Statuscode 500 oder 200. Falls Fehler auftritt(bei Validierung), wird Error mit Status Code 500 zurückgeschickt.    

## In-Memory Datenbank

- Für in-memory Datenbank wird und kann man Redis benutzen.
- Zusatzlich könnte Replikas in MongoDb erstellt werden.

## Event-Auslösung

- Event-Auslösung erfolgt mit Konsolen-Log. 

## Skalierbarkeit

- Skalierbarkeit erfolgt, wenn man in MongoDB Indexierung durchführt und mit Redis verbindet

## Deployment-Strategie 

- Express Server könnte in Docker Container laufen.
- Deployment könnte mit Github durchgrüfurt werden.

Annahmen bzgl. Architektur wurde in Teil "Beschriebung" genannt. NextJS wird für Frontend Seite benutzt, um Frontend zu bedienen, mit Backend mit fetch Anfrage zu verbinden und letzendlich zu testen. NodeJS mit Express Server wird in Backend benutzt, um POST Anfrage zu bearbeiten und Event nach Frontend zurüskzuschicken. MongoDB wird benutzt mit Ware, Client zu arbeiten, um produktId und clientid abzuschicken.

## OMS in AWS Cloud 

- Falls in Datenbank neuen Antrag mit Bestellung abgelegt wird, dann wird AWS Lambda Funktion triggert, um die Daten zu validieren und wird CSV Datei erstellt 

- Am Schluss wird mit AWS SES E-Mail mit CSV Verknüpfung als Bestätigung abgeschickt.
