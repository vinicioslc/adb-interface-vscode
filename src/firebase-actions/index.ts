import { ADBResult, ADBResultState } from '../adb-manager'
import { ConsoleChannel } from '../console-channel'
import firebaseCommands from './firebase-commands'

export class FirebaseManagerChannel extends ConsoleChannel {
  enableFirebaseDebugView(appPackageID: string) {
    let finalResult = new ADBResult(ADBResultState.Error, 'Error ocurred')

    const output = this.consoleInstance
      .execConsoleSync(
        firebaseCommands.SHELL_SETPROP_FIREBASE_ANALYTICS(appPackageID)
      )
      .toLocaleString()
    if (output == '') {
      finalResult = new ADBResult(
        ADBResultState.Success,
        `Connected to device ${appPackageID}`
      )
    }

    return finalResult
  }
  disableFirebaseDebugView() {
    let finalResult = new ADBResult(ADBResultState.Error, 'Some Error Ocurred')

    const output: String = this.consoleInstance
      .execConsoleSync(firebaseCommands.DISABLE_FIREBASE_ANALYTICS())
      .toLocaleString()

    if (output == '') {
      finalResult = new ADBResult(ADBResultState.Success, `Disabled debug mode`)
    }

    return finalResult
  }
}
