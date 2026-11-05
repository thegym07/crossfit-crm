# La Salle CrossFit — CRM Prospects

CRM interne de La Salle CrossFit (38 rue d'Alès, 07200 Saint-Sernin), copie conforme du CRM THE GYM
(`thegym07/CRM`) : Prospects, RDV & Relances, Agenda coachs, Rapport, Commissions, Rentabilité, Réglages.

Tout ce qui est propre à la box (adresse, tarifs, commissions, activités, page Facebook) est dans `lib/salle.ts`.

## Stack

Next.js 16 (App Router) · Supabase (PostgreSQL, clé service role côté serveur uniquement) · Tailwind 4 · Vercel.

## Variables d'environnement (Vercel)

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | base Supabase |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (ou `ADMIN_PASSWORD`) | compte partagé de l'équipe |
| `SESSION_SECRET` | signature des sessions |
| `META_PAGE_ACCESS_TOKEN` | lecture des leads de la page Facebook La Salle CrossFit |
| `META_APP_SECRET` (facultatif) | vérification de la signature Meta |
| `SMTP_USER`, `SMTP_PASSWORD` (`SMTP_HOST`/`SMTP_PORT` facultatifs) | e-mails depuis contact@lasallecrossfit.fr (IONOS) |

## Leads Meta

La page Facebook est abonnée (`leadgen`) à l'app Meta « CRM THE GYM ». Meta n'accepte qu'une adresse de rappel
par app : le webhook du CRM THE GYM reçoit la notification et la relaie telle quelle (corps + signature) à
`/api/leads/meta` ici, qui ne garde que les leads de la page La Salle CrossFit et les relit chez Meta.

## Base de données

`supabase/schema.sql` (à exécuter dans l'éditeur SQL). Keepalive quotidien : cron Vercel `/api/cron/keepalive`.
