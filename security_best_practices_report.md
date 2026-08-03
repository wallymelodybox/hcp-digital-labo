# Audit de sécurité — HCP Digital Labo

Date : 3 août 2026  
Périmètre : application Next.js, routes API, back-office, intégration Kadev Pay, stockage local, dépendances et configuration HTTP.

## Synthèse exécutive

L’audit a confirmé deux failles critiques : des identifiants administrateur connus utilisés par défaut et une validation de paiement qui ne comparait pas le montant payé au prix attendu et ne bloquait pas la réutilisation d’une référence. Ces deux failles sont corrigées.

Les dépendances vulnérables ont été mises à jour et l’audit `pnpm` ne signale désormais aucune vulnérabilité connue. Des protections ont aussi été ajoutées contre le CSRF administratif, les abus d’API, les payloads excessifs, le clickjacking et l’utilisation abusive de l’optimiseur d’images.

Le risque résiduel principal est le stockage des inscriptions et paiements dans des fichiers JSON. Ce mécanisme ne fournit pas de transaction ni de contrainte d’unicité partagée entre plusieurs instances. Il doit être remplacé par une base de données transactionnelle avant toute mise en production avec de vrais paiements.

## Critique

### SEC-001 — Identifiants administrateur par défaut — Corrigé

- Sévérité : Critique
- Emplacement : `middleware.ts`, protection du back-office ; `lib/admin-auth.ts:31`
- Preuve avant correction : utilisation de `ADMIN_USER || "admin"` et `ADMIN_PASSWORD || "password123"`.
- Impact : prise de contrôle complète du back-office lorsque les secrets ne sont pas configurés.
- Correction : suppression des valeurs par défaut, refus fermé avec réponse 503 si la configuration manque, décodage robuste et comparaison résistante aux attaques temporelles.
- Défense complémentaire : limitation locale des échecs d’authentification et réponses administratives `no-store`.

### SEC-002 — Confirmation d’un paiement d’un montant insuffisant ou réutilisé — Corrigé

- Sévérité : Critique
- Emplacement : `lib/site-storage.ts:162`, `app/api/formation-registrations/confirm-payment/route.ts:36`, `app/api/webhooks/kadev/route.ts:56`
- Preuve avant correction : toute transaction Kadev au statut `paid` confirmait l’inscription ciblée, sans comparaison au prix enregistré et sans unicité de la référence.
- Impact : une petite transaction valide pouvait confirmer une formule plus chère ; une même référence pouvait confirmer plusieurs inscriptions.
- Correction : égalité stricte entre montant payé et prix serveur, validation du format de référence, interdiction de réutilisation, idempotence et verrou local d’écriture.
- Défense complémentaire : la vérification manuelle est désormais réservée à une mutation administrateur authentifiée ; le navigateur public dépend du webhook signé.

## Élevé

### SEC-003 — Structure du webhook Kadev incorrecte — Corrigé

- Sévérité : Élevée
- Emplacement : `app/api/webhooks/kadev/route.ts:38`
- Preuve avant correction : lecture de `status`, `reference` et `amount` au premier niveau du payload.
- Impact : les webhooks conformes à la documentation pouvaient être ignorés, laissant les paiements dans un état incohérent et poussant à des validations manuelles risquées.
- Correction : validation de `event` au premier niveau et lecture des données dans `data`, conformément à la documentation Kadev ; parsing JSON protégé et taille limitée.
- Référence : https://pay.kadev.ci/developer-documentation/

### SEC-004 — Dépendances comportant des avis de sécurité — Corrigé

- Sévérité : Élevée
- Emplacement : `package.json:51`, `package.json:69`, `package.json:76`
- Preuve avant correction : Next.js 16.1.6, PostCSS 8.5.6 et lodash 4.17.23 transitif ; l’audit remontait 19 alertes élevées et 19 modérées.
- Correction : Next.js 16.3.0, PostCSS 8.5.25, Supabase 2.112.0 et override lodash 4.18.1.
- Vérification : `pnpm audit --registry=https://registry.npmjs.org` retourne 0 vulnérabilité connue.

### SEC-005 — Stockage JSON non transactionnel pour les paiements — Risque résiduel bloquant

- Sévérité : Élevée
- Emplacement : `lib/json-store.ts:10`, `lib/json-store.ts:20`, `lib/site-storage.ts:130`
- Preuve : lecture puis réécriture complète de fichiers JSON locaux.
- Impact : perte de données, écrasements concurrents, double utilisation possible entre plusieurs processus/instances, absence de contrainte `UNIQUE` durable et stockage éphémère ou non partagé sur plusieurs hébergeurs serverless.
- Mitigation appliquée : verrou local et contrôle d’unicité dans le processus (`lib/site-storage.ts:65`). Les fichiers susceptibles de contenir des données personnelles ne sont plus suivis par Git.
- Correction requise avant production : migrer vers PostgreSQL/Supabase avec une transaction et une contrainte `UNIQUE(reference_paiement)`, ainsi qu’un contrôle atomique des places et des codes promotionnels.
- Faux positif : aucun si l’application est déployée sur plusieurs instances ou sur un système de fichiers éphémère. Un serveur unique avec disque persistant réduit le risque, sans fournir les garanties nécessaires à un système de paiement.

## Moyen

### SEC-006 — Absence de limites d’abus et validation trop permissive — Corrigé

- Sévérité : Moyenne
- Emplacement : `lib/request-security.ts:12`, `app/api/formation-registrations/route.ts:11`, `app/api/contact/route.ts:10`
- Impact : spam, remplissage disque, énumération de codes, surcharge du service et données anormalement longues.
- Correction : limites de débit, tailles maximales de payload, bornes de champs, formats de référence et liste fermée des modes de paiement.
- Limite : le rate limiting en mémoire n’est pas global entre instances. Configurer aussi une limite distribuée au niveau CDN/WAF en production.

### SEC-007 — En-têtes de sécurité absents — Corrigé

- Sévérité : Moyenne
- Emplacement : `next.config.mjs:40`
- Impact : clickjacking, sniffing MIME, politique de permissions trop large et surface XSS accrue.
- Correction : CSP, `frame-ancestors`, `X-Frame-Options`, `nosniff`, politique de référent, permissions minimales et politique d’ouverture compatible avec la fenêtre de paiement.
- Limite : `unsafe-inline` reste autorisé pour les scripts afin de conserver la compatibilité Next/Kadev. Une CSP à nonce est recommandée lors d’une prochaine itération.

### SEC-008 — Optimiseur d’images ouvert à tous les domaines — Corrigé

- Sévérité : Moyenne
- Emplacement : `next.config.mjs:13`, `next.config.mjs:14`
- Impact : requêtes serveur vers des hôtes arbitraires et épuisement du cache d’images.
- Correction : domaine optimisé limité à `images.unsplash.com`, cache disque borné à 100 Mio et médias administrables chargés sans proxy d’optimisation.

### SEC-009 — SDK de paiement tiers mutable sans SRI — Risque résiduel

- Sévérité : Moyenne
- Emplacement : `components/formation-pricing.tsx`, fonction `loadKadevScript`
- Preuve : chargement dynamique de `https://pay.kadev.ci/js/v1/kadev-pay.js`, URL recommandée par le fournisseur mais sans empreinte SRI publiée.
- Impact : une compromission du fournisseur ou du fichier distant exécuterait du JavaScript dans l’origine du site.
- Mitigation : domaine limité explicitement par CSP ; aucune clé secrète Kadev n’est exposée au client.
- Correction recommandée : demander à Kadev une version immuable avec hash SRI, ou auto-héberger une version contractuellement autorisée et surveillée.

### SEC-010 — Authentification Basic sans MFA — Risque résiduel

- Sévérité : Moyenne
- Emplacement : `middleware.ts`, `lib/admin-auth.ts`
- Impact : un mot de passe volé donne directement accès au back-office.
- Mitigation : mot de passe obligatoire, comparaison sûre, limitation locale des essais, contrôle d’origine sur toutes les mutations.
- Correction recommandée : placer le back-office derrière une authentification avec MFA ou un proxy d’identité, et ajouter un rate limiting distribué.

## Données et secrets

- `.env*` est ignoré, avec un modèle sans secret dans `.env.example`.
- `data/contact-requests.json` et `data/formation-registrations.json` ne sont plus suivis ; ils étaient vides au moment de l’audit.
- Aucune donnée bancaire n’est collectée par l’application ; la saisie du paiement est déléguée à Kadev Pay.
- Cet audit de code ne constitue pas une certification PCI DSS, un test d’intrusion externe ou une validation de la configuration réelle de l’hébergeur.

## Vérifications réalisées

- `npm run build` : réussi sous Next.js 16.3.0.
- TypeScript : réussi pendant la compilation.
- `pnpm audit --registry=https://registry.npmjs.org` : 0 vulnérabilité connue.
- `git diff --check` : aucune erreur de patch ou espace invalide.
- Recherche statique : aucun identifiant administrateur par défaut restant, aucune clé secrète préfixée `NEXT_PUBLIC_`, aucun `eval` ou `new Function` applicatif.

