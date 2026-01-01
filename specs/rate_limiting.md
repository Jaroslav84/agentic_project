# System Spec: API Rate Limiting

## 1. Overview
Implement a distributed rate limiting features for the public API to prevent abuse and ensure fair usage among tenants.

## 2. Goals
- Protect the backend from denial-of-service (DoS) attacks.
- Enforce usage quotas for different service tiers (Free vs. Pro).

## 3. Functional Requirements

### 3.1 Rate Limits
- **Anonymous IPs**: 60 requests per minute.
- **Authenticated Users (Free)**: 1000 requests per hour.
- **Authenticated Users (Pro)**: 10,000 requests per hour.

### 3.2 Headers
rate-limited responses must include:
- `X-RateLimit-Limit`: The limit applied.
- `X-RateLimit-Remaining`: Requests left in the current window.
- `X-RateLimit-Reset`: Timestamp when the window resets.

### 3.3 Response
- Return `429 Too Many Requests` when limit is exceeded.
- Include a JSON body: `{ "error": "Rate limit exceeded", "retry_after": <seconds> }`.

## 4. Technical Implementation

### 4.1 Storage
- Use Redis for storing counters.
- Key format: `ratelimit:{type}:{identifier}` (e.g., `ratelimit:ip:192.168.1.1` or `ratelimit:user:123`).

### 4.2 Algorithm
- Implement the "Token Bucket" or "Sliding Window" algorithm for accuracy.

### 4.3 Middleware
- Implement as a FastAPI middleware (dependency injection) that runs before route handlers.
