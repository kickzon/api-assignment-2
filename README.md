# Bokmärkt

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

Bokmärkt är en fullstack-applikation för att upptäcka böcker och läsa eller skriva recensioner. Applikationen har autentisering med en httpOnly-cookie och rollbaserad behörighet för besökare, användare och administratörer.

Projektet skapades ursprungligen som en gruppuppgift i kursen API-utveckling på Medieinstitutet. Den här versionen vidareutvecklas självständigt som ett portfolio-projekt.

## Funktioner

### Besökare

- Se alla böcker och öppna en enskild boksida.
- Läsa och skapa recensioner.
- Registrera ett konto och logga in.

### Inloggad användare

- Se och uppdatera sitt eget konto.
- Byta användarnamn och lösenord.
- Radera sitt eget konto.
- Logga ut.

### Administratör

- Se samtliga användare.
- Befordra andra användare till admin eller ta bort deras adminroll.
- Skapa, uppdatera och radera böcker.
- Uppdatera och radera recensioner.

## Säkerhet

- Lösenord hashas med `bcrypt` innan de sparas i MongoDB.
- Inloggning skapar en JWT som lagras i en httpOnly-cookie.
- Skyddade routes verifierar både token och att användaren fortfarande finns.
- Admin-routes skyddas av separat middleware för rollkontroll.
- Användarrollen hämtas från databasen vid skyddade anrop, så rolländringar gäller direkt.
- Den vanliga kontouppdateringen kan inte ändra `is_admin`.
- Lösenord returneras inte i API-svar.

## Tekniker

- Node.js
- Express
- TypeScript
- MongoDB och Mongoose
- JSON Web Token
- bcrypt
- HTML, CSS och JavaScript

## Kom igång lokalt

### Förutsättningar

- Node.js
- npm
- En MongoDB-databas, exempelvis i MongoDB Atlas

### Installation

1. Klona repot och öppna projektmappen:

   ```bash
   git clone https://github.com/kickzon/api-assignment-2.git
   cd api-assignment-2
   ```

2. Installera beroenden:

   ```bash
   npm install
   ```

3. Skapa `.env` i projektroten med följande variabler:

   ```env
   MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>/bokmarkt?retryWrites=true&w=majority
   JWT_SECRET=<your-secret>
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

   En JWT-hemlighet kan genereras med:

   ```bash
   openssl rand -base64 32
   ```

   `.env` är ignorerad av Git och ska aldrig committas.

4. Starta utvecklingsservern:

   ```bash
   npm run dev
   ```

5. Öppna [http://localhost:3000](http://localhost:3000).

### Skapa den första administratören

Nya konton skapas alltid som vanliga användare. För att konfigurera den första administratören behöver ett befintligt användardokument därför uppdateras manuellt i MongoDB:

```json
{
  "is_admin": true
}
```

Värdet ska vara en boolean. Därefter kan administratören hantera andra användares roller från adminpanelen.

## API

Alla endpoints använder prefixet `/api`.

| Metod | Endpoint | Behörighet | Beskrivning |
|---|---|---|---|
| `POST` | `/auth/register` | Öppen | Registrera användare |
| `POST` | `/auth/login` | Öppen | Logga in och skapa cookie |
| `POST` | `/auth/logout` | Öppen | Rensa inloggningscookien |
| `GET` | `/auth/me` | Inloggad | Hämta den egna användaren och rollen |
| `GET` | `/books` | Öppen | Hämta alla böcker |
| `GET` | `/books/:id` | Öppen | Hämta en bok med recensioner |
| `POST` | `/books` | Admin | Skapa en bok |
| `PATCH` | `/books/:id` | Admin | Uppdatera en bok |
| `DELETE` | `/books/:id` | Admin | Radera en bok och dess recensioner |
| `GET` | `/reviews` | Öppen | Hämta alla recensioner |
| `GET` | `/reviews/:id` | Öppen | Hämta en recension |
| `POST` | `/reviews` | Öppen | Skapa en recension |
| `PATCH` | `/reviews/:id` | Admin | Uppdatera en recension |
| `DELETE` | `/reviews/:id` | Admin | Radera en recension |
| `GET` | `/users` | Admin | Hämta alla användare |
| `GET` | `/users/:id` | Eget konto eller admin | Hämta en användare |
| `PATCH` | `/users/:id` | Eget konto | Uppdatera konto |
| `DELETE` | `/users/:id` | Eget konto | Radera konto |
| `PATCH` | `/users/:id/role` | Admin | Ändra en annan användares roll |

## Scripts

```bash
npm run dev     # Starta utvecklingsservern med watch-läge
npm run build   # Kompilera TypeScript
npm start       # Starta den kompilerade applikationen
```

## Projektstruktur

```text
api/                 Express-applikationens startpunkt
public/              Klientens HTML, CSS och JavaScript
src/controllers/     Logik för API-anrop
src/middleware/      Autentisering och behörighetskontroll
src/models/          Mongoose-modeller
src/routes/          API-routes
```

## Bakgrund och bidrag

Den ursprungliga gruppuppgiften delades upp i användare, böcker och recensioner. Arbetet gjordes i separata branches och granskades genom pull requests.

| Namn | GitHub | Ursprungligt ansvarsområde |
|---|---|---|
| Chiara | [@kickzon](https://github.com/kickzon) | Användare, autentisering och användarpanel |
| Angelie | [@ngeliecode](https://github.com/ngeliecode) | Böcker och bokhantering |
| Ika | [@ikaossler](https://github.com/ikaossler) | Recensioner och enskild boksida |

I portfolio-versionen har Chiara bland annat vidareutvecklat varumärket Bokmärkt, navigationen, bokkorten och den rollbaserade behörigheten.
