# Security Policy: OAuth Implementation

## Overview
This document outlines the security controls and requirements for implementing OAuth 2.0 authentication within our application. All implementations must adhere to these standards to prevent common vulnerabilities such as CSRF, token leakage, and account takeovers.

## 1. Authorization Code Flow with PKCE
- **Requirement**: ALL OAuth flows must use **Authorization Code Flow with Proof Key for Code Exchange (PKCE)**.
- **Why**: Prevents authorization code interception attacks.
- **Implementation**:
  - Client generates a `code_verifier` and `code_challenge`.
  - `code_challenge` is sent in the authorization request.
  - `code_verifier` is sent in the token exchange request.

## 2. State Parameter (CSRF Protection)
- **Requirement**: The `state` parameter MUST be used and verified.
- **Implementation**:
  - Generate a random, cryptographically secure string for the `state` parameter before redirects.
  - Store this state temporarily (e.g., in a secure, HTTP-only cookie).
  - Upon callback, verify that the `state` returned by the provider matches the stored state.
- **Failure**: If states do not match, the authentication attempt MUST be rejected immediately.

## 3. Token Storage & Handling
- **Access Tokens**:
  - SHOULD be short-lived (e.g., 1 hour).
  - MUST NOT be stored in `localStorage` or `sessionStorage` due to XSS vulnerability.
  - RECOMMENDED: Store in memory for the session or an `HttpOnly`, `SameSite=Strict` cookie.
- **Refresh Tokens**:
  - MUST be stored securely (e.g., `HttpOnly` cookie).
  - MUST implement rotation (issue new refresh token on use).

## 4. Scope Minimization
- **Principle**: Request only the minimal scopes necessary for the application to function.
- **Example**:
  - Request `email` and `profile` only for login.
  - Do NOT request `calendar.readonly` unless the user explicitly enables a calendar integration feature.

## 5. Redirect URI Validation
- **Requirement**: Use exact matching for Redirect URIs registered with the Identity Provider (IdP).
- **Prevention**: Prevents open redirect attacks where an attacker could steal auth codes.

## 6. Error Handling
- Do not expose detailed error messages from the IdP to the user.
- Log authentication failures with relevant context (but redact sensitive tokens) for security auditing.
