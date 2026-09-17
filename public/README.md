# 📚 Book API - Gruppuppgift API-utveckling

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

## 📖 Om projektet

Detta är en gruppuppgift i kursen API-utveckling, där vi bygger ett Book API tillsammans med en klient som är lösenordsskyddat. Applikationen låter besökare bläddra bland böcker och skriva recensioner samt ger inloggade administratörer möjlighet att hantera användare och böcker.

## 👥 Gruppmedlemmar

| Namn | GitHub | Ansvarsområde |
|---|---|---|
| Chiara | [@kickzon](https://github.com/kickzon) | 🔐 Ansvarsområde 1 - Users (autentisering, inloggning, adminpanel för användare) |
| Angelie | [@ngeliecode](https://github.com/ngeliecode) | 📚 Ansvarsområde 2 - Books (boklista, admin-hantering av böcker) |
| Ika | [@ikaossler](https://github.com/ikaossler) | Ansvarsområde 3 - Reviews (specifik boksida, recensionsformulär, recensionslista) |

## ⚙️ Metoder

**Arbetssätt:**
- Uppgiften var uppdelad i tre ansvarsområden (users, books, reviews), en per gruppmedlem
- Varje ansvarsområde byggdes i tre steg: MongoDB-modell → API-endpoints → klientsidor

**Git-arbetsflöde:**
- Var och en jobbade i egna branches
- Alla ändringar gick via Pull Requests innan de mergades till `main`
- Vi stämde av gemensamt kring delar som påverkade flera personers kod

**Verktyg & Tekniker:**
- 🖥️ Backend: Node.js, Express, TypeScript
- 🗄️ Databas: MongoDB
- 🎨 Klient: HTML, CSS, JavaScript