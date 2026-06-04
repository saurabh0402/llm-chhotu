# Notes
## Running on Phone
- Start Metro Server
  ```bash
  yarn start
  ```
- Run
  ```bash
  npx react-native run-android
  ```

## Building APK
- Go into the `android` folder
  ```bash
  cd android
  ```
- Build the APK
  ```bash
  ./gradlew assembleRelease
  ```

## Changing App Icon
- Update the images in `android/app/src/main/res/mipmap-*` folders.
- There are two files - `ic_launcher.png` and `ic_launcher_round.png`. Remember to update both.

## Changing App Name
- Update the value of the `string` tag with name attribute `app_name` in `android/app/src/main/res/values/string.xml`.

## View Logs
```bash
adb logcat '*:S' ReactNative:V ReactNativeJS:V
```

# Tools, Tools, Everywhere
- [duckduckgo search](https://duck-duck-scrape.js.org/)
- [searxng](https://docs.searxng.org/user/index.html)
- [react-native linking](https://reactnative.dev/docs/linking)
- [react-native common intents](https://github.com/wahdatjan/react-native-common-intents/blob/master/src/index.js)

