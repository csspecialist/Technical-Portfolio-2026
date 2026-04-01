# SecureAuth — Quickstart Guide

Get up and running with MFA enrollment and verification in minutes.

## Prerequisites

- A valid SecureAuth account
- Your Bearer Token (issued from the developer dashboard)
- A TOTP-compatible authenticator app (e.g., Google Authenticator,
  Authy)

## Authentication

All requests require an `Authorization` header containing your Bearer
Token.
```http
Authorization: Bearer <YOUR_TOKEN>
```

## Endpoints

### POST /v1/mfa/enroll

Enrolls a user in TOTP-based multi-factor authentication.

#### Request

```http
POST /v1/mfa/enroll HTTP/1.1
Host: api.secureauth.io
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "user_id": "usr_01HXYZ",
  "method": "totp"
}
```

#### Response — 200 OK

```json
{
  "enrollment_id": "enr_09ABCD",
  "totp_uri": "otpauth://totp/SecureAuth:usr_01HXYZ?secret=SECRET32",
  "qr_code_url": "https://api.secureauth.io/qr/enr_09ABCD.png"
}
```

#### Response Fields

| Field           | Type   | Description                           |
|-----------------|--------|---------------------------------------|
| `enrollment_id` | string | Unique identifier for this enrollment |
| `totp_uri`      | string | OTP Auth URI for authenticator apps   |
| `qr_code_url`   | string | URL to the scannable QR code image    |

---

### POST /v1/mfa/verify

Verifies a TOTP code submitted by the user.

#### Request

```http
POST /v1/mfa/verify HTTP/1.1
Host: api.secureauth.io
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "enrollment_id": "enr_09ABCD",
  "totp_code": "123456"
}
```

#### Response — 200 OK

```json
{
  "verified": true,
  "session_token": "sess_XYZ789..."
}
```

#### Response — 401 Unauthorized

```json
{
  "verified": false,
  "error": "invalid_totp_code"
}
```

#### Response Fields

| Field           | Type    | Description                           |
|-----------------|---------|---------------------------------------|
| `enrollment_id` | string  | Enrollment ID returned at enroll step |
| `totp_code`     | string  | 6-digit code from your authenticator  |
| `verified`      | boolean | `true` if verification succeeded      |
| `session_token` | string  | Session token issued on success       |

---

## Error Codes

| Code                   | Status | Description                        |
|------------------------|--------|------------------------------------|
| `invalid_token`        | 401    | Bearer Token is missing or invalid |
| `user_not_found`       | 404    | The specified `user_id` not found  |
| `invalid_totp_code`    | 401    | TOTP code is incorrect or expired  |
| `enrollment_not_found` | 404    | No enrollment matches that ID      |

---

## Next Steps

- Review rate limits in the full [API Reference](../api-reference.md).
- Enable backup codes via `POST /v1/mfa/backup`.
- Contact support at support@secureauth.io.
