# Tempo - Security & Authentication

## Authentication Strategy

### Phase 0 (MVP)
- **Email/Password**: Traditional auth via Supabase Auth
- **Google OAuth**: Social login via Supabase
- **JWT Tokens**: 1-hour expiry, refresh token auto-renewal
- **Secure Token Storage**: React Native Keychain (iOS) / Keystore (Android)

### Phase 2+
- Apple Sign-In (iOS)
- Biometric auth (fingerprint, face recognition)
- Two-factor authentication (2FA)

---

## JWT Token Management

### Token Lifecycle
```
1. User logs in → Supabase Auth validates credentials
2. Returns access_token (1hr expiry) + refresh_token (7-30 days)
3. App stores refresh_token in secure device keychain
4. Access token stored in memory (lost on app restart)
5. When access token expires → use refresh_token to get new access_token
6. On logout → invalidate refresh_token server-side + clear device keychain
```

### Token Payload (JWT)
```json
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "iat": 1733450400,
  "exp": 1733454000,
  "aud": "authenticated"
}
```

### Implementation (React Native)
```javascript
// Store tokens securely
import * as SecureStore from 'expo-secure-store'; // or react-native-keychain

const storeTokens = async (accessToken, refreshToken) => {
  await SecureStore.setItemAsync('access_token', accessToken);
  await SecureStore.setItemAsync('refresh_token', refreshToken);
};

// Retrieve and use access token
const getAccessToken = async () => {
  return await SecureStore.getItemAsync('access_token');
};

// Refresh token flow
const refreshAccessToken = async () => {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  const { accessToken, refreshToken: newRefresh } = await API.post('/auth/refresh', {
    refresh_token: refreshToken
  });
  await storeTokens(accessToken, newRefresh);
  return accessToken;
};
```

---

## Password Security

### Requirements
- Minimum 12 characters (allow longer for better entropy)
- At least 1 uppercase, 1 lowercase, 1 number, 1 special character
- No common passwords (enforced by Supabase Auth)

### Hashing
- Passwords hashed with bcrypt (10 rounds, done by Supabase Auth)
- Never log passwords or tokens
- Never send passwords over unencrypted connection

### Password Reset Flow
```
1. User requests password reset → Email sent with reset link
2. Link valid for 24 hours
3. Reset link contains signed token (cannot be forged)
4. New password must pass complexity requirements
5. Old sessions invalidated after reset
```

---

## Data Encryption

### In Transit
- **HTTPS/TLS**: All API calls encrypted via TLS 1.2+
- **Certificate Pinning**: (Optional Phase 1) Pin API certificate to prevent MITM
- **CORS**: Only allow requests from registered app bundles (iOS/Android)

### At Rest
- **Database**: PostgreSQL at Supabase (encrypted by default)
- **Device Storage**: 
  - Sensitive data (tokens): Keychain/Keystore
  - App data: SQLite (unencrypted for MVP, can encrypt in Phase 1)
- **Cloud Files**: Supabase Storage (encrypted at rest)

### Sensitive Data Classification
- **PII**: Email, name, handicap → Keep in encrypted DB
- **Auth**: Tokens → Device keychain only
- **Location**: GPS coords → Encrypted in transit, normal DB at rest
- **Scores**: No encryption needed (non-sensitive)

---

## API Security

### Authentication Checks
```javascript
// Every API route requires JWT token
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Auth required' });
  
  try {
    const decoded = verifyJWT(token);
    req.userId = decoded.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});
```

### User Isolation
```javascript
// Only allow users to see their own data
app.get('/rounds', (req, res) => {
  const rounds = db.query('SELECT * FROM rounds WHERE user_id = $1', [req.userId]);
  res.json(rounds);
});
// ❌ WRONG: SELECT * FROM rounds (user could see others' data)
```

### Input Validation
```javascript
// Validate all inputs before DB queries
app.post('/rounds', (req, res) => {
  const { course_id, tee_type } = req.body;
  
  // Validate course_id is UUID
  if (!isValidUUID(course_id)) return res.status(400).json({ error: 'Invalid course_id' });
  
  // Validate tee_type is enum
  if (!['blue', 'white', 'red', 'black'].includes(tee_type)) {
    return res.status(400).json({ error: 'Invalid tee_type' });
  }
  
  // Safe query (Prisma prevents SQL injection)
  const round = db.rounds.create({ user_id: req.userId, course_id, tee_type });
  res.json(round);
});
```

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

// General rate limit
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  keyGenerator: (req) => req.userId, // Per user
  skip: (req) => req.userId === ADMIN_ID // Skip for admins
});

app.use('/api/', limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.ip // Per IP (not authenticated yet)
});

app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);
```

### CORS Configuration
```javascript
app.use(cors({
  origin: [
    'https://api.tempo-golf.com', // API domain
    'https://app.tempo-golf.com', // Web app (Phase 2+)
    // React Native apps don't send Origin header by default
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
```

---

## Mobile App Security

### Permissions
- **Location**: Always request in-app with explanation
  - iOS: `NSLocationWhenInUseUsageDescription` + `NSLocationAlwaysAndWhenInUseUsageDescription`
  - Android: `android.permission.ACCESS_FINE_LOCATION`
- **Camera**: Request before AR features used
  - iOS: `NSCameraUsageDescription`
  - Android: `android.permission.CAMERA`

### Code Obfuscation & Signing
- **iOS**: App signed with development/distribution certificate
- **Android**: App signed with release keystore
- **Debugging**: Disable debugger in production builds

### Sensitive Logs
```javascript
// ❌ NEVER log sensitive data
console.log('User token:', token);
console.log('Email:', email);

// ✅ Safe logging
console.log('User authenticated');
console.log('Round created:', roundId);
```

---

## Third-Party Integrations Security

### Supabase Auth
- Uses OAuth 2.0 flows
- Credentials handled by Supabase (never see user password)
- Can rotate secrets via Supabase dashboard

### Weather API
- Free tier may have rate limits
- Don't expose API key in client code → call via backend
- Cache responses (weather doesn't change frequently)

### Payment Gateway (Phase 1+)
- Never handle card data directly
- Use Stripe/PayPal hosted payment forms
- Store only `payment_method_id`, never full card details
- Webhook verification: Validate signature before processing payment

---

## Data Privacy & Compliance

### Data Retention
- **Active user data**: Retained indefinitely (user owns their data)
- **Deleted user data**: Anonymized within 30 days
- **Backup data**: Kept for 7 days (disaster recovery)
- **Logs**: Retained for 90 days, then deleted

### User Data Export
- Users can request export of their data (GDPR compliance)
- API endpoint: `GET /users/me/export` → returns JSON
- Available as downloadable file within app

### User Data Deletion
- Users can request account deletion
- Mark as "deleted" + anonymize immediately
- Hard delete after 30-day grace period (can restore if accidental)

### Privacy Policy
- Must disclose: GPS collection, score tracking, cloud storage
- Must state: No data sold to third parties
- Must state: Optional analytics (Mixpanel) can be disabled

---

## Incident Response Plan

### Security Vulnerability Found
1. **Assess Severity**
   - Critical: Immediate fix + hotfix deployment
   - High: Fix in next release
   - Medium/Low: Standard release cycle

2. **Notification**
   - Internal team notified immediately
   - Users notified if data breach → Email + in-app notification
   - Timeline: Notify within 72 hours of discovery

3. **Remediation**
   - Fix code
   - Update all affected systems
   - Rotate compromised credentials
   - Audit logs for exploitation evidence

### Breach Response
- Affected users notified with recommended actions
- Reset sessions (log out all users)
- Monitor for unauthorized access
- Post-incident review: What went wrong? How to prevent?

---

## Secrets Management

### Environment Variables (Backend)
```bash
# .env (never commit to repo)
DATABASE_URL=postgresql://...
JWT_SECRET=very-long-random-string
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_API_KEY=sk_live_...
WEATHER_API_KEY=...

# Supabase provides these
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Store Secrets
- **Development**: Local `.env` file (git-ignored)
- **Staging**: GitHub Secrets (encrypted, visible only to admins)
- **Production**: AWS Secrets Manager or Supabase vault

### Rotate Secrets
- Quarterly security audit → Rotate all secrets
- If compromised → Immediate rotation
- Keep audit log of rotations

---

## Security Checklist (MVP Launch)

- [ ] All endpoints require authentication
- [ ] User isolation enforced (can't see others' data)
- [ ] Passwords hashed with bcrypt
- [ ] Tokens stored securely on device (keychain/keystore)
- [ ] All inputs validated before DB queries
- [ ] Rate limiting enabled on all endpoints
- [ ] HTTPS/TLS enforced (no plain HTTP)
- [ ] Secrets not committed to repo
- [ ] CORS configured properly
- [ ] Error messages don't leak sensitive info
- [ ] No logs of tokens/passwords/emails
- [ ] Penetration test passed (external security audit)
- [ ] Privacy policy updated
- [ ] Data retention policy documented

---

## Monitoring & Alerts

### What to Monitor
- Failed login attempts (brute force detection)
- Unusual API usage patterns (sudden spike)
- Database query errors (potential injection)
- Unauthenticated API requests (misconfiguration)
- External IP accessing admin endpoints (unauthorized access)

### Alerting
- Sentry: Errors + exceptions → Email admin
- CloudWatch: API latency > 1s → Slack alert
- Database: Slow queries → Email DBA
- Firewall: Blocked IPs attempting attacks → Log only (don't spam)

---

**Last Updated**: December 6, 2025  
**Version**: MVP-SECURITY-1.0
