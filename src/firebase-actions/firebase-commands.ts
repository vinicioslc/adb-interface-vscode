export default {
  SHELL_SETPROP_FIREBASE_ANALYTICS: (package_name = '') =>
    `adb shell setprop debug.firebase.analytics.app ${package_name}`,
  DISABLE_FIREBASE_ANALYTICS: () =>
    `adb shell setprop debug.firebase.analytics.app .none.`
}
