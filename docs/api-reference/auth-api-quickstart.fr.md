# SecureAuth — Guide de démarrage rapide

Configurez l'enrôlement et la vérification AMF en quelques minutes.

## Prérequis

- Un compte SecureAuth actif
- Votre jeton d'accès (Bearer Token), émis depuis le tableau de bord
  développeur
- Une application d'authentification compatible TOTP (ex. : Google
  Authenticator, Authy)

## Authentification

Chaque requête doit inclure un en-tête `Authorization` contenant votre
jeton d'accès.

```http
Authorization: Bearer <VOTRE_JETON>
```

## Points de terminaison

### POST /v1/mfa/enroll

Enrôle un utilisateur dans l'authentification multifacteur (AMF) TOTP.

#### Requête d'enrôlement

```http
POST /v1/mfa/enroll HTTP/1.1
Host: api.secureauth.io
Authorization: Bearer <VOTRE_JETON>
Content-Type: application/json

{
  "user_id": "usr_01HXYZ",
  "method": "totp"
}
```

#### Réponse d'enrôlement — 200 OK

```json
{
  "enrollment_id": "enr_09ABCD",
  "totp_uri": "otpauth://totp/SecureAuth:usr_01HXYZ?secret=SECRET32",
  "qr_code_url": "https://api.secureauth.io/qr/enr_09ABCD.png"
}
```

#### Champs de la réponse d'enrôlement

| Champ           | Type   | Description                              |
|-----------------|--------|------------------------------------------|
| `enrollment_id` | string | Identifiant unique de cet enrôlement     |
| `totp_uri`      | string | URI OTP Auth pour les apps d'authentif.  |
| `qr_code_url`   | string | URL vers l'image du code QR à scanner    |

---

### POST /v1/mfa/verify

Vérifie un code TOTP soumis par l'utilisateur.

#### Requête de vérification

```http
POST /v1/mfa/verify HTTP/1.1
Host: api.secureauth.io
Authorization: Bearer <VOTRE_JETON>
Content-Type: application/json

{
  "enrollment_id": "enr_09ABCD",
  "totp_code": "123456"
}
```

#### Réponse de vérification — 200 OK

```json
{
  "verified": true,
  "session_token": "sess_XYZ789..."
}
```

#### Réponse de vérification — 401 Non autorisé

```json
{
  "verified": false,
  "error": "invalid_totp_code"
}
```

#### Champs de la réponse de vérification

| Champ           | Type    | Description                             |
|-----------------|---------|-----------------------------------------|
| `enrollment_id` | string  | Identifiant retourné à l'enrôlement     |
| `totp_code`     | string  | Code à 6 chiffres de votre application  |
| `verified`      | boolean | `true` si la vérification a réussi      |
| `session_token` | string  | Jeton de session émis en cas de succès  |

---

## Codes d'erreur

| Code                   | Statut | Description                              |
|------------------------|--------|------------------------------------------|
| `invalid_token`        | 401    | Jeton manquant ou invalide               |
| `user_not_found`       | 404    | Identifiant `user_id` introuvable        |
| `invalid_totp_code`    | 401    | Code TOTP incorrect ou expiré            |
| `enrollment_not_found` | 404    | Aucun enrôlement trouvé pour cet ID      |

---

## Étapes suivantes

- Consultez les limites de débit dans la
  [Référence API](../api-reference.md) complète.
- Activez les codes de secours via `POST /v1/mfa/backup`.
- Contactez le support à support@secureauth.io.
