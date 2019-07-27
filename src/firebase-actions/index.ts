import { ADBResult, ADBResultState } from '../adb-actions'
import { execSync } from 'child_process'

export function enableFirebaseDebugView(appPackageID: string) {
  var finalResult = new ADBResult(ADBResultState.Error, 'Invalid package Name')

  const output: String = execSync(
    `adb shell setprop debug.firebase.analytics.app ${appPackageID}`
  ).toLocaleString()

  finalResult = new ADBResult(
    ADBResultState.Success,
    `Connected to device ${appPackageID}`
  )

  return finalResult
}

export function disableFirebaseDebugView() {
  var finalResult = new ADBResult(ADBResultState.Error, 'Some Error Ocurred')

  const output: String = execSync(
    `adb shell setprop debug.firebase.analytics.app .none.`
  ).toLocaleString()

  if (output.includes('connected to')) {
    finalResult = new ADBResult(ADBResultState.Success, `Disabled debug mode`)
  }

  return finalResult
}
