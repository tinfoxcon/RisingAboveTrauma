# RevenueCat Subscription Setup Complete ✅

## What's Been Configured

### 1. RevenueCat Project Linked
- **Project:** project-6J3l5aPR (proj9c52360e)
- **Status:** ✅ Connected to Anything platform
- **API Keys:** Automatically configured for Test Store, App Store, and Play Store

### 2. Subscription Tiers Created

#### **Survivor Shield**
- Monthly: $6.99/month with 3-day free trial
- Annual: $59/year with 3-day free trial
- **Unlocks:**
  - Pattern Map Tracker (trend tracking)
  - Court-Ready Evidence Export (PDF generation)
  - In The Moment Scripts (crisis support scripts)
  - Premium audio resets

#### **Survivor Rise**
- Monthly: $12.99/month with 3-day free trial
- Annual: $99/year with 3-day free trial
- **Unlocks:**
  - All Shield features
  - All 5 healing courses
  - Course worksheets
  - Quizzes and certificates
  - Progress tracking

#### **Free Tier** (Always Available)
- Check-In
- Safety Plan
- Calm and Affirmations
- Resources
- 911
- Exit
- Discreet Mode

### 3. RevenueCat Structure
```
Offering: "Subscription Plans" (default, current)
  └── Packages:
      ├── Shield Monthly ($rc_monthly)
      ├── Shield Annual ($rc_annual)
      ├── Rise Monthly ($rc_custom_rise_monthly)
      └── Rise Annual ($rc_custom_rise_annual)

Entitlements:
  ├── "shield" (granted by Shield + Rise products)
  └── "rise" (granted by Rise products only)

Apps:
  ├── Test Store (active for development)
  ├── App Store (ready for production - needs ASC connection)
  └── Play Store (ready for production)
```

### 4. Code Implementation Complete

#### Files Created/Updated:
1. **`/apps/mobile/src/utils/useInAppPurchase.js`**
   - Custom hook for managing subscriptions
   - Handles purchases, restores, and entitlement checks
   - Syncs with backend

2. **`/apps/web/src/app/api/revenue-cat/sync-subscription/route.js`**
   - Server-side subscription verification
   - Updates user tier in database
   - Caches subscription status

3. **`/apps/mobile/src/app/(tabs)/upgrade.jsx`**
   - Integrated RevenueCat subscriptions
   - Displays real pricing from RevenueCat
   - Handles purchases and restoration
   - Shows current subscription status

4. **`/apps/mobile/APPLE_APP_REVIEW_NOTES.md`**
   - App Store submission notes
   - External link compliance explanations

## Testing in Development

### Test Store (Current Setup)
✅ **Ready to test NOW in your Expo preview**

The Test Store is already configured with:
- All 4 subscription products
- Correct pricing ($6.99, $59, $12.99, $99)
- 3-day trial periods
- Monthly and annual durations

### How to Test:
1. Open your app in Expo Go or custom dev client
2. Navigate to the Upgrade tab
3. You'll see all subscription options with test pricing
4. Purchases will use RevenueCat's Test Store (sandbox)
5. No real money is charged

## Production Setup (Required Before App Store Submission)

### ⚠️ IMPORTANT: App Store Connect Required
To publish to the Apple App Store, you **MUST** connect App Store Connect:

1. **Visit** App Store Connect settings to link your account
2. Ensure your App Store Connect account is fully set up:
   - ✓ Paid Apps Agreement signed
   - ✓ Tax forms completed
   - ✓ Bank details uploaded
   - ✓ Latest Apple legal terms accepted

3. **Once connected**, you'll need to:
   - Create subscription products in App Store Connect
   - Set pricing for all territories
   - Add review screenshots
   - Submit for Apple review

### Why This Matters:
- ❌ **Without ASC:** Subscriptions only work in development (Test Store)
- ✅ **With ASC:** Subscriptions work in TestFlight and production App Store

## Feature Gating Implementation

The app now checks subscription tiers using:
```javascript
const { subscriptionTier, hasShieldAccess, hasRiseAccess } = useInAppPurchase();

// Free tier: subscriptionTier === 'free'
// Shield tier: subscriptionTier === 'shield' OR hasShieldAccess === true
// Rise tier: subscriptionTier === 'rise' OR hasRiseAccess === true
```

### Where to Add Feature Gates:
- **Pattern Map Tracker:** Check `hasShieldAccess || hasRiseAccess`
- **Evidence Export:** Check `hasShieldAccess || hasRiseAccess`
- **Scripts Library:** Check `hasShieldAccess || hasRiseAccess`
- **Courses:** Check `hasRiseAccess`

## Database Schema
The `auth_users` table already has these columns:
- `subscription_tier` ('free', 'shield', 'rise')
- `subscription_status` ('active', 'inactive')
- `last_check_subscription_status_at`

## Next Steps

### For Development:
1. ✅ Test subscriptions in Expo preview
2. ✅ Verify purchase flow works
3. ✅ Test restore purchases
4. ✅ Confirm tier-based feature access

### For Production:
1. Connect App Store Connect via App Store Connect settings
2. Wait for Anything platform to sync ASC credentials
3. Create subscription products in ASC (or let Anything create them)
4. Add review screenshots to subscriptions
5. Test in TestFlight
6. Submit for App Store review

## Environment Variables Already Set
These were automatically configured when linking RevenueCat:
- `EXPO_PUBLIC_REVENUE_CAT_TEST_STORE_API_KEY`
- `EXPO_PUBLIC_REVENUE_CAT_APP_STORE_API_KEY`
- `EXPO_PUBLIC_REVENUE_CAT_PLAY_STORE_API_KEY`
- `REVENUE_CAT_API_KEY` (server-side)

## Support Resources
- RevenueCat Dashboard: https://app.revenuecat.com/
- Anything Docs: https://www.anything.com/docs/revenuecat
- App Store Connect: https://appstoreconnect.apple.com/

---

**Your subscriptions are ready to use in development!** 🎉

When you're ready for production, connect App Store Connect and the platform will help you configure the rest.
