# Feature Spec: OAuth 2.0 Authentication

## 1. Overview
Implement OAuth 2.0 authentication to allow users to sign in using their Google or GitHub accounts. This will improve user acquisition by removing the friction of creating a new username and password.

## 2. Goals
- Support "Sign in with Google"
- Support "Sign in with GitHub"
- Maintain security best practices for token handling
- Seamlessly link creating a new user account if one doesn't exist

## 3. Functional Requirements

### 3.1 Google OAuth
- **Button**: display "Continue with Google" on the login page.
- **Scope**: Request `email` and `profile` scopes.
- **Flow**: Standard Authorization Code with PKCE.

### 3.2 GitHub OAuth
- **Button**: Display "Continue with GitHub".
- **Scope**: Request `user:email` scope.

### 3.3 Account Linking
- If a user signs in with an email that already exists (e.g., from password auth), link the accounts.
- If the email is new, create a new `User` flow.

### 3.4 API Endpoints
- `GET /auth/google/login` - Redirects to Google.
- `GET /auth/google/callback` - Handles the code exchange.
- `GET /auth/github/login` - Redirects to GitHub.
- `GET /auth/github/callback` - Handles the code exchange.

## 4. Technical Constraints
- Must use `python-jose` for JWT handling.
- Secrets must be stored in environment variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc.).
- Use `httpx` for back-channel requests to providers.
