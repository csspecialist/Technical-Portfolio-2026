---
title: "Mode opératoire (SOP) – Configuration du VPN avec MFA (Support L3)"
description: "Procédure d'exploitation normalisée pour la configuration sécurisée du VPN et de l'authentification multifacteur pour l'équipe de support L3."
version: "1.0.0"
status: "Approuvé"
date: "2026-04-01"
author: "Maliki Kamara"
standard_alignment:
  - ISO/IEC 27001:2022
  - RGPD (Règlement général sur la protection des données)
tags:
  - cybersécurité
  - vpn
  - mfa
  - contrôle-d-accès
---

## Mode opératoire – Configuration du VPN avec MFA (Support L3)

---

## 1. Objectif

Définir une procédure sécurisée et auditable pour la configuration et la
validation de l'accès VPN protégé par l'authentification multifacteur (MFA).

---

## 2. Portée

Cette procédure s'applique aux :

- Ingénieurs support de niveau 3 (L3).
- Postes de travail gérés (Windows, macOS, Linux).
- Passerelles VPN et fournisseurs d'identité (IdP) approuvés.

---

## 3. Définitions (Terminologie ANSSI)

- **VPN** : Réseau privé virtuel assurant un canal chiffré.
- **MFA** : Authentification multifacteur (au moins deux facteurs).
- **IdP** : Fournisseur d'identité responsable de l'authentification.
- **SIEM** : Système de gestion des événements de sécurité.
- **SMSI** : Système de management de la sécurité de l'information.

---

## 4. Rôles et responsabilités

| Rôle | Responsabilité |
| :--- | :--- |
| **Support L3** | Appliquer la procédure et maintenir son MFA. |
| **Cybersecurité** | Configurer le VPN et surveiller les journaux. |
| **Équipe GIA** | Gérer les identités et l'enrôlement MFA. |
| **Gestion de parc** | Assurer la conformité des postes de travail. |

---

## 5. Procédure technique

### Étape 1 – Lancement du client

Ouvrez le client VPN approuvé sur votre poste de travail géré.

### Étape 2 – Création du profil

- Saisissez l'URL de la passerelle.
- Protocole : **SSL VPN** (par défaut).

### Étape 3 – Configuration MFA

- Mode d'authentification : **SAML** ou **RADIUS** avec MFA.
- Activez l'usage des identifiants (nom d'utilisateur/mot de passe).

### Étape 4 – Sécurisation du flux

- Activez le **VPN permanent** (*Always-On*) si requis.
- Désactivez le tunnelage fractionné (*split tunneling*).
- Activez la protection contre les fuites DNS.

---

## 6. Critères de vérification

1. La connexion VPN est établie avec succès.
2. L'accès aux ressources internes est validé par un test de flux.
3. Les journaux de connexion sont visibles dans le SIEM.

---

> **Note de conformité (Europe) :** Ce document respecte les exigences du
> RGPD concernant la sécurisation des accès et les recommandations de
> l'ANSSI pour la protection des systèmes d'information.
