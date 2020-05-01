import { ADBResult, ADBResultState } from '../adb-manager'
import { ConsoleChannel } from '../console-channel'
import * as FIREBASE_COMMANDS from './firebase-commands'
import { ADBInterfaceError } from './../adb-manager'

export class FirebaseManagerChannel extends ConsoleChannel {
  public enableFirebaseDebugView(appPackageID: string): ADBResult {
    let finalResult: ADBResult = null

    const output = this.consoleInstance
      .execConsoleSync(
        FIREBASE_COMMANDS.SHELL_SETPROP_FIREBASE_ANALYTICS(appPackageID)
      )
      .toString()
    if (output == '') {
      finalResult = new ADBResult(
        ADBResultState.Success,
        `Connected to device ${appPackageID}`
      )
    }

    if (!finalResult) {
      throw new ADBInterfaceError('Error cause: ' + output)
    }
    return finalResult
  }
  public disableFirebaseDebugView(): ADBResult {
    let finalResult: ADBResult = null

    const output: string = this.consoleInstance
      .execConsoleSync(FIREBASE_COMMANDS.DISABLE_FIREBASE_ANALYTICS())
      .toString()

    if (output == '') {
      finalResult = new ADBResult(ADBResultState.Success, `Disabled debug mode`)
    }

    if (!finalResult) {
      throw new ADBInterfaceError('Error cause: ' + output)
    }
    return finalResult
  }
}
