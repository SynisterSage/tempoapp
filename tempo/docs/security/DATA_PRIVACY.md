# Tempo - Data Privacy & Compliance

## GDPR Compliance

### Legal Basis
Tempo operates under **Legitimate Interest** for user data collection:
- User scores, shots, and statistics improve app functionality
- Location data (GPS) required for core app feature (course mapping)
- User explicitly consents during signup

### User Rights (Articles 15-22)
- **Right of Access**: Users can download their data via `/users/me/export` endpoint
- **Right to Correction**: Users can edit profile, handicap, club setup
- **Right to Deletion**: Users can request account deletion (anonymized within 30 days)
- **Right to Data Portability**: Export as JSON/CSV (handled by export endpoint)
- **Right to Object**: Can opt-out of analytics (Mixpanel cookie preference)
- **Right to Restrict**: Can pause data collection (disable location tracking)

### Data Processing Agreement (DPA)
- Supabase is Data Processor (PostgreSQL hosting)
- User is Data Subject (owns their golf scores)
- Tempo (us) is Data Controller (decides what data to collect)
- DPA available at: [supabase.com/dpa](https://supabase.com/dpa)

### Data Protection Officer (DPO)
- If handling data of 250+ EU users, designate DPO
- Contact: privacy@tempo-golf.com
- Responsibilities: Privacy compliance oversight, breach notification

---

## Data Collection & Usage

### Required Data (Core Features)
| Data | Purpose | Retention | Legal Basis |
|------|---------|-----------|-------------|
| Email | Account login, password reset | Until deletion | Contract |
| Name | Profile display | Until deletion | Consent |
| Golf handicap | Stats calculation | User-controlled | Consent |
| GPS coordinates | Course mapping, shot tracking | 7 years (archived) | Legitimate interest |
| Scorecard data | Stats aggregation | Indefinite | Legitimate interest |
| Camera frames (AR) | Slope/lie detection, not stored | Real-time only | Consent |

### Optional Data (Analytics)
| Data | Purpose | Retention | Legal Basis |
|------|---------|-----------|-------------|
| Mixpanel events | Feature usage analytics | 1 year | Consent (opt-in) |
| Sentry errors | Crash reporting | 90 days | Legitimate interest |
| App version, OS version | Performance monitoring | 90 days | Legitimate interest |

### Data NOT Collected
- ❌ Biometric data (fingerprint, face) — Never stored, only used for device unlock
- ❌ Camera frames (AR) — Processed locally, never sent to servers
- ❌ Payment card details — Handled by Stripe (PCI-DSS compliant)
- ❌ Social media data — Not synced or requested
- ❌ Location history timeline — Only current position for shots, not full history

---

## Data Retention Policy

### Active User Data
```
Scores & stats   → Kept indefinitely (user owns data)
GPS coordinates  → Kept indefinitely (part of scorecard)
User profile     → Kept indefinitely
Tokens           → Invalidated 7 days after logout
Auth logs        → Kept 1 year for compliance
```

### Deleted User Data
```
Timeline: User requests deletion
  ↓
Day 0: Mark account "deleted", anonymize name → "User-[UUID]"
  ↓
Day 30: Grace period (user can restore account)
  ↓
Day 31: Hard delete all personal data (scores remain anonymized)
  ↓
Day 90: Delete backup copies
```

### Archived Data
```
Rounds played 7+ years ago → Archive (can be restored)
Deleted user data after 90 days → Permanent delete
Logs older than 1 year → Delete
```

---

## Third-Party Data Sharing

### Data Shared
| Third Party | Data Shared | Purpose | Legal Agreement |
|-------------|-------------|---------|-----------------|
| Supabase | All user data | Database hosting | DPA ✅ |
| Google OAuth | Email, name, profile pic | Authentication | OAuth 2.0 terms |
| Weather API | GPS coordinates | Current weather | API terms |
| Stripe | Payment method ID | Payment processing | PCI-DSS ✅ |
| Sentry | Error events, OS version | Crash reporting | DPA ✅ |
| Mixpanel | Event logs (if opted-in) | Usage analytics | DPA ✅ |

### Data NOT Shared
- ❌ Scorecards (not shared with other apps)
- ❌ Location history (not shared with third parties)
- ❌ Email list (not sold to advertisers)

### Sub-processor Approval
- All third parties must have privacy policies
- All have EU-US Data Transfer agreements (SCCs)
- Users notified via Privacy Policy
- Users can opt-out of non-essential sharing (analytics)

---

## Privacy Policy Template

```markdown
# Tempo Golf - Privacy Policy

**Last Updated**: [DATE]
**Effective Date**: [DATE]

## 1. Introduction
Tempo collects and processes golf data to improve your game and provide personalized stats.
We take your privacy seriously.

## 2. Data We Collect
- **Account Data**: Email, name, handicap, club setup
- **Game Data**: Scores, shots, GPS coordinates, weather conditions
- **Device Data**: App version, OS version, device type (for analytics)
- **Camera**: AR camera frames processed locally, not stored

## 3. How We Use Your Data
- Provide core app features (scoring, stats, course mapping)
- Improve app performance (crash reports, analytics)
- Send account notifications (score saved, weekly stats)
- Generate personalized drill recommendations (Phase 1+)
- Comply with legal obligations

## 4. Your Rights
- **Access**: Download your data (Settings → Export My Data)
- **Correction**: Edit your profile and scores
- **Deletion**: Request account deletion (anonymized after 30 days)
- **Portability**: Export data as JSON
- **Object**: Opt-out of analytics (Settings → Privacy)

## 5. Data Retention
- Active user data: Indefinite (until deletion)
- Deleted user data: Anonymized immediately, hard-deleted after 30 days
- Server logs: 90 days
- Analytics: 1 year
- Backups: 7 days

## 6. Data Security
- All data encrypted in transit (HTTPS/TLS 1.2+)
- Passwords hashed with bcrypt
- Tokens stored securely (device keychain)
- Database encrypted at rest

## 7. Third Parties
We share data with Supabase (hosting), Google (auth), Weather API, and Stripe (payments).
See Data Sharing table above for details.

## 8. Children Under 13
Tempo is not intended for children under 13. We do not knowingly collect data from users under 13.
If we discover such data, we delete it immediately.

## 9. Contact
Email: privacy@tempo-golf.com
Mailing: [Your Company Address]

## 10. Changes to This Policy
We may update this policy. Changes effective when posted to app.
Users will be notified of material changes.
```

---

## California Consumer Privacy Act (CCPA)

### CCPA Rights (California Residents)
1. **Right to Know**: Users can see what personal info is collected
2. **Right to Delete**: Request deletion of personal info (with exceptions)
3. **Right to Opt-Out**: Opt-out of data sales (if Tempo sells data, which we don't)
4. **Right to Non-Discrimination**: Users can't be charged more or denied service for exercising rights

### Implementation
- Privacy Policy must disclose rights
- Implement `/users/me/request-data` endpoint (send user data within 45 days)
- Implement `/users/me/request-deletion` endpoint (delete within 45 days)
- Track opt-out preferences → Honor in analytics collection

---

## Children's Online Privacy Protection Act (COPPA)

### COPPA Compliance (US children under 13)
- **Parental Consent**: Require verifiable parental consent for users under 13
- **Limited Collection**: Collect only data necessary for functionality
- **No Marketing**: No targeting ads to children
- **Retention**: Delete child data upon request

### Implementation (if supporting under-13 users)
```javascript
// Age verification at signup
app.post('/auth/register', (req, res) => {
  const { email, birthDate } = req.body;
  const age = calculateAge(birthDate);
  
  if (age < 13) {
    // Require parental consent
    // Send email to parent: "Your child wants to use Tempo"
    // Parent must verify via email link
    // Only enable account after parental consent
  }
});
```

**For MVP**: Recommend setting minimum age to 13+ (avoids COPPA complexity)

---

## Cookie & Tracking Policy

### First-Party Cookies
- **Session Cookie**: `session_token` (1 hour, auth required)
- **Preference Cookie**: `analytics_opt_in` (1 year, user preference)

### Third-Party Cookies
- **Google Analytics**: If analytics enabled (Mixpanel alternative)
- **Stripe**: Payment processing (PCI-DSS)
- None others.

### Cookie Consent Banner
```javascript
// Show banner on first app open
if (!localStorage.getItem('cookie_consent_given')) {
  showCookieConsentBanner();
}

// User must accept before analytics enabled
if (localStorage.getItem('analytics_opt_in') === 'true') {
  initializeAnalytics();
}
```

### Opt-Out Options
- Users can disable analytics in Settings → Privacy
- Do Not Track (DNT) header respected: Don't enable analytics if DNT = 1
- Can delete cookies via: Settings → Clear Cache & Cookies

---

## Biometric Data

### Face ID / Touch ID (Device-Level)
- Never collected or stored by Tempo
- Used locally by iOS/Android for device unlock only
- Disabled in production (for safety: require PIN for golf app)

### Biometric Data (Future)
- If Phase 2+ uses biometrics for auth, NEVER store actual biometric data
- Instead: Store biometric "template" (anonymized hash) on device only
- Never transmit biometric data over network

---

## AI/ML Data Privacy

### Model Training Data
- **Never** use user scores to train public models
- **Can** use anonymized aggregate data for recommendations
- **Example**:
  - ❌ Wrong: "Lex's scores on Pebble Beach show he slices" (identifies user)
  - ✅ Right: "Users with 12 handicap average 78 shots on Pebble Beach" (anonymized)

### Model Versioning
- Keep audit log of model versions + training data
- Disclose to users if model accuracy changes significantly
- Allow users to opt-out of personalized recommendations

---

## Right to Explanation (AI)

### Transparency
- If AI recommends drill: Show why
  - Example: "Based on your recent shots from 150-175 yards, we recommend working on mid-iron accuracy"
- Users can request explanation of any AI decision
- Endpoint: `GET /ai/recommendation/:id/explanation`

### Override
- Users can ignore AI recommendations
- Can manually select drills
- Feedback helps improve model (with permission)

---

## Privacy by Design Principles

1. **Data Minimization**: Collect only what's needed
   - ✅ Collect: GPS coordinates (core feature)
   - ❌ Collect: Career golf history from social media

2. **Purpose Limitation**: Use data only for stated purpose
   - ✅ Use: GPS data for score mapping
   - ❌ Use: GPS data to track user location outside app

3. **Storage Limitation**: Delete when no longer needed
   - ✅ Delete: Logs older than 90 days
   - ❌ Store: All logs forever

4. **Integrity & Confidentiality**: Protect data from misuse
   - ✅ Encrypt: All data in transit (TLS)
   - ❌ Send: Passwords in plain text

5. **Accountability**: Document everything
   - ✅ Audit log: Who accessed data when
   - ❌ No logging: Can't prove data wasn't misused

---

## Data Breach Notification

### If Breach Occurs
1. **Investigate** (within 24 hours): What data was exposed?
2. **Assess Risk** (within 48 hours): Could users be harmed?
3. **Notify** (within 72 hours):
   - GDPR: Notify supervisory authority (Data Protection Authority)
   - CCPA: Notify affected California residents
   - Other: Follow state laws if applicable
4. **Communicate**: Transparent, honest communication with users
   - What happened
   - What data was exposed
   - What we're doing to fix it
   - What users should do (change password, monitor credit card, etc.)

### Example Notification Email
```
Subject: Security Alert - Tempo Account Data

Dear Lex,

On [DATE], we discovered that unauthorized parties accessed some user data,
including email addresses and hashed passwords (not plaintext).

**What we know:**
- Email addresses were accessed
- Passwords are hashed (cannot be used directly)
- Golf scores were NOT accessed
- GPS data was NOT accessed

**What we're doing:**
- Reset all password hashes
- Investigating root cause
- Implementing additional security measures

**What you should do:**
- Change your password immediately
- Enable two-factor authentication (when available)
- Monitor your email for suspicious activity
- Contact us if you see unauthorized activity

We sincerely apologize and appreciate your patience.

Tempo Security Team
```

---

## Privacy Audit & Compliance Checklist

- [ ] Privacy Policy written and accessible in app
- [ ] All data flows documented (what, why, where)
- [ ] Third-party DPAs signed (Supabase, Google, Stripe)
- [ ] User consent mechanisms implemented
- [ ] Data retention policy enforced (automated deletion)
- [ ] GDPR rights implemented (export, deletion, portability)
- [ ] CCPA rights implemented (if serving California users)
- [ ] Breach notification plan documented
- [ ] Data Processing Impact Assessment (DPIA) completed
- [ ] Annual privacy audit scheduled
- [ ] Privacy notice on signup form
- [ ] Opt-out mechanisms working (analytics, marketing)
- [ ] No unauthorized third-party data sharing
- [ ] Biometric data handled correctly (if used)
- [ ] Children's data protected (if under-13 users)

---

**Last Updated**: December 6, 2025  
**Version**: MVP-PRIVACY-1.0  
**Responsible**: Lex Ferguson, Tempo Golf
