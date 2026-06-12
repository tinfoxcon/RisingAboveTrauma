# Native iOS and Android Project Setup

Generated native project folders have been added for the Expo SDK 54 React Native app.

## Added

- `ios/` native Xcode project, Podfile, Info.plist, assets, splash screen, entitlements, and Expo/React Native bootstrap code.
- `android/` native Gradle project, AndroidManifest.xml, app/build.gradle, Gradle wrapper, resources, launcher icons, splash assets, and Expo/React Native bootstrap code.
- `package.json` scripts:
  - `npm run ios`
  - `npm run android`
- Explicit Android package in `app.json`: `com.createinc.x02687c08e3f94ef49b5e3fff129ac942`.

## Verified configuration

- iOS bundle identifier: `com.createinc.02687c08e3f94ef49b5e3fff129ac942`.
- Android applicationId / namespace: `com.createinc.x02687c08e3f94ef49b5e3fff129ac942`.
- iOS Face ID permission is present in `Info.plist`.
- Android biometric permissions are present in `AndroidManifest.xml`.
- iOS app icon and splash assets were generated under `Images.xcassets`.
- Android launcher/adaptive icon and splash assets were generated under `android/app/src/main/res`.
- Expo Updates configuration and project id were carried into native configuration.
- Google Mobile Ads app ids were applied to iOS and Android native projects.

## Validation performed in this environment

- `expo prebuild --no-install` completed successfully and generated both native folders.
- `expo config --type public` completed successfully after generation.
- `expo-doctor` passed 15/18 checks. The failed checks were network/API dependent or expected for a project that now contains native folders:
  - Expo config schema check failed because `exp.host` could not be reached from this environment.
  - React Native Directory metadata check failed because the external directory service could not be reached.
  - Expo Doctor warns that native config fields in `app.json` are not automatically synced once native folders exist; this is expected after ejecting/prebuilding and means future config changes should be re-applied with prebuild or manually reflected in native projects.
- Android Gradle build was attempted but could not complete because the Gradle distribution could not be downloaded from `services.gradle.org` in this environment.
- iOS native compilation could not be performed because this Linux environment does not provide Xcode/CocoaPods simulator tooling.
- TypeScript check currently reports pre-existing project type errors in `__create`, `polyfills/web`, and `src/__create`; these were not introduced by native folder generation.

## Local build steps

From `apps/mobile`:

```bash
npm install
npm run android
npm run ios
```

For a clean native regeneration after config changes:

```bash
npx expo prebuild --clean
```

Then run platform-specific builds from `android/` or `ios/` as needed.
