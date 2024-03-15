Mirus Works Kiosk App
---

## About
- React Native [v61](https://reactnative.dev/versions)
- iOS & Android

## Requirements
- [Android Studio](https://developer.android.com/studio)
- [Apple Xcode](https://developer.apple.com/xcode/)
- NodeJS v10+

## Installation
1. `npm install`

## Development
- `npx react-native run-ios`
- `npx react-native run-android`

## Publishing
- Xcode: Target "Generic Device" and Product->Archive then Upload
- Android: Build->Generate Signed Bundle/APK and choose App Bundle.

Note when prompted: Android Keystore file is `./android/android-apk-key`, passwords are both `salary-nativity-watch-cuts`, and the alias is `key0`.
