---
title: "PNN (SOP) – Configuration du VPN sécurisé avec AMF pour les ingénieurs de soutien L3"
version: "1.0.0"
status: "Approuvé"
date: "2026-03-31"
author: "Maliki Kamara"
standard_alignment:
  - ISO/IEC 27001:2022
  - Loi sur la langue officielle et commune du Québec (Loi 96)
tags:
  - cybersécurité
  - vpn
  - amf
  - contrôle-d-accès
---

## PNN – Configuration du VPN sécurisé avec AMF pour les ingénieurs de soutien L3

---

## 1. Objectif

Définir une procédure normalisée, sécurisée et auditable pour la configuration
et la validation de l'accès VPN protégé par l'authentification multifacteur (AMF)
pour les ingénieurs de soutien technique de niveau 3 (L3).

---

## 2. Portée

Cette procédure s'applique aux :

- Ingénieurs de soutien L3 nécessitant un accès à distance privilégié.
- Points de terminaison gérés par l'entreprise (Windows, macOS, Linux).
- Passerelles VPN et fournisseurs d'identité (IdP) approuvés.

Cette procédure exclut :

- Utilisateurs non privilégiés.
- Appareils personnels ou non gérés (AVEC/BYOD).
- Utilisateurs sans droits d'accès approuvés.

---

## 3. Définitions

- **VPN** : Réseau privé virtuel permettant un accès à distance sécurisé.
- **AMF** : Authentification multifacteur nécessitant au moins deux facteurs de vérification.
- **IdP** : Fournisseur d'identité responsable de l'authentification.
- **SIEM** : Système de gestion des événements et des informations de sécurité.
- **SGSI** : Système de gestion de la sécurité de l'information.

---

## 4. Rôles et responsabilités

| Rôle | Responsabilité |
| :--- | :--- |
| **Soutien L3** | Appliquer la procédure, gérer l'AMF et les incidents. |
| **Cybersécurité** | Configurer le VPN, l'AMF et surveiller les journaux. |
| **Équipe GIA** | Gérer les identités et l'enrôlement à l'AMF. |
| **Gestion terminaux** | Assurer la conformité des appareils. |
| **Centre services** | Fournir un soutien de niveau 1 et 2. |

---

## 5. Aperçu du processus

Le processus d'authentification VPN suit les étapes suivantes :

1. L'ingénieur initialise une connexion VPN à l'aide du client approuvé.
2. Le client VPN envoie une demande d'accès à la passerelle VPN.
3. La passerelle VPN transmet l'authentification au fournisseur d'identité (IdP).
4. L'IdP valide les identifiants et déclenche un défi AMF
   pour l'utilisateur.
5. L'ingénieur relève le défi AMF.
6. Une fois l'authentification réussie, un tunnel VPN sécurisé
   est établi.

---

## 6. Alignement de la conformité (ISO/IEC 27001:2022)

| Contrôle | Description |
|----------|-------------|
| A.5.17 | Authentification sécurisée (application de l'AMF) |
| A.5.18 | Gestion des droits d'accès |
| A.5.19 | Contrôle d'accès |
| A.8.9 | Configuration sécurisée |
| A.8.16 | Surveillance et journalisation |

---

## 7. Prérequis

Avant de commencer, assurez-vous d'avoir :

- Un compte d'entreprise actif avec accès privilégié approuvé.
- Un appareil enrôlé dans la gestion des terminaux (ex. : Intune, JAMF).
- L'AMF configurée avec au moins deux facteurs.
- Le client VPN approuvé installé.
- L'URL de la passerelle VPN et les identifiants disponibles.
- Les certificats requis installés (le cas échéant).

---

## 8. Procédure

### 8.1 Configuration du client VPN

#### Étape 1 – Lancer le client

Ouvrez le client VPN approuvé sur l'appareil géré.

#### Étape 2 – Créer le profil VPN

- Saisissez l'URL de la passerelle VPN.
- Sélectionnez le protocole :
  - SSL VPN (par défaut).
  - IPSec (uniquement si requis).

#### Étape 3 – Configurer l'authentification

- Réglez la méthode d'authentification sur SAML ou RADIUS avec AMF.
- Activez l'authentification par nom d'utilisateur et mot de passe.
- Sélectionnez le certificat si requis.

#### Étape 4 – Appliquer les paramètres de sécurité

- Activez le VPN toujours actif (*Always-On*) si requis.
- Désactivez le tunnelage fractionné (*split tunneling*) sauf approbation explicite.
- Activez la protection contre les fuites DNS.
- Appliquez TLS 1.2 ou une version ultérieure.
- Utilisez les serveurs DNS de l'entreprise.

### 8.2 Configuration de l'AMF

#### Étape 5 – Enrôlement AMF

- Enregistrez au moins deux facteurs :
  - Application d'authentification (primaire).
  - Méthode de secours (jeton matériel ou code de récupération).

#### Étape 6 – Validation de l'AMF

- Effectuez une authentification de test.
- Confirmez que le défi AMF est déclenché.
- Confirmez la réussite de l'authentification.

### 8.3 Établissement de la connexion VPN

#### Étape 7 – Initialiser la connexion

- Sélectionnez le profil VPN.
- Saisissez les identifiants.

#### Étape 8 – Compléter l'AMF

- Approuvez la demande AMF.
- Attendez la confirmation de la connexion.

### 8.4 Validation post-connexion

#### Étape 9 – Valider l'accès au réseau

- Résolvez le DNS interne.
- Accédez aux systèmes internes.
- Confirmez l'attribution de l'adresse IP VPN.

#### Étape 10 – Valider l'état de la sécurité

- Confirmez la conformité du terminal.
- Vérifiez que le tunnelage fractionné est désactivé.
- Confirmez que les journaux apparaissent dans le SIEM.

---

## 9. Critères de vérification

### Fonctionnel

- État du VPN = Connecté.
- AMF déclenchée avec succès.
- Ressources internes accessibles.

### Sécurité

- Journaux enregistrés dans le SIEM.
- AMF appliquée pour toutes les sessions.
- Aucune tentative non autorisée détectée.

### Performance

- Latence < 100 ms.
- Perte de paquets < 1 %.

---

## 10. Gestion des pannes

| Problème | Action |
|----------|--------|
| AMF non déclenchée | Réenrôler l'AMF ou vérifier l'IdP. |
| Échec de connexion VPN | Vérifier DNS, certificats, conformité. |
| Échec d'authentification | Réinitialiser les identifiants ou escalader. |

---

## 11. Procédure de repli (Rollback)

1. Déconnectez le VPN.
2. Restaurez la configuration VPN précédente.
3. Supprimez les certificats incorrects.
4. Annulez les modifications de configuration du terminal.
5. Escaladez à la cybersécurité si le problème n'est pas résolu.

---

## 12. Risques de sécurité

- Accès non autorisé sans AMF.
- VPN mal configuré exposant le trafic interne.
- Tunnelage fractionné entraînant une fuite de données.

---

## 13. Exceptions

Les exceptions doivent :

- Être documentées et justifiées.
- Être approuvées par le RSSI ou son délégué.
- Inclure des contrôles compensatoires.
- Être révisées annuellement.

---

## 14. Registres et preuves

| Registre | Rétention |
|----------|-----------|
| Journaux VPN | 12 à 24 mois |
| Journaux AMF | Selon la politique GIA |
| Rapports de conformité | Selon la politique des terminaux |
| Billets d'incident | Selon la politique de gestion des services |

---

## 15. Gestion du changement

- Soumettre une demande de changement formelle.
- Obtenir l'approbation de la cybersécurité et de la GIA.
- Mettre à jour la version de la PNN et l'historique des révisions.
- Communiquer les changements aux parties prenantes.

---

## 16. Historique des révisions

| Version | Date | Auteur | Changements |
|---------|------|--------|-------------|
| 1.0.0 | 2026-03-31 | Maliki Kamara | Version initiale (Conformité Loi 96) |

---

## 17. Annexes

### Annexe A – Clients VPN approuvés

- Cisco AnyConnect
- Palo Alto GlobalProtect
- Fortinet FortiClient
- OpenVPN
- WireGuard (si approuvé)

### Annexe B – Méthodes AMF approuvées

- Application d'authentification (TOTP ou notification)
- Jeton matériel FIDO2
- Carte à puce / PIV
- Codes de récupération de secours

---

> **Note de conformité (Loi 96) :** Ce document a été rédigé en français
> pour assurer la conformité aux exigences linguistiques du Québec concernant
> les outils de travail et la documentation technique interne.
