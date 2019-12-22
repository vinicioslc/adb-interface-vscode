/* istanbul ignore file */
export function SHELL_SETPROP_FIREBASE_ANALYTICS(package_name = '') {
  return `adb shell setprop debug.firebase.analytics.app ${package_name}`
}

export function DISABLE_FIREBASE_ANALYTICS() {
  return `adb shell setprop debug.firebase.analytics.app .none.`
}
