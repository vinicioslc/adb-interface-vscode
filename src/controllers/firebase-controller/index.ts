import * as vscode from 'vscode'
import { ADBInterfaceException, ADBConnection } from '../../adb-wrapper'
import * as appStateKeys from '../../extension/global-state-keys'
import { FirebaseManagerChannel } from '../../firebase-channel/index'
import { ADBController } from './../../Infraestructure/ADBController'

export class FirebaseController extends ADBController {
  private firebaseInstance: FirebaseManagerChannel
  appStateKeys: typeof appStateKeys

  constructor(
    context: vscode.ExtensionContext,
    firebaseChannel: FirebaseManagerChannel
  ) {
    super(context)
    this.firebaseInstance = firebaseChannel
    this.appStateKeys = appStateKeys
  }

  async onInit() {
    await this.registerCommand(
      'adbInterface.enableFirebaseDebug',
      this.EnableFirebaseDebugView
    )
    await this.registerCommand(
      'adbInterface.disableFirebaseDebug',
      this.DisableFirebaseDebugView
    )
  }

  genericErrorReturn(e: Error) {
    if (e instanceof ADBInterfaceException) {
      vscode.window.showWarningMessage(e.message)
    } else {
      vscode.window.showErrorMessage('Error:' + e.message)
    }
  }

  async EnableFirebaseDebugView() {
    try {
      const lastvalue = this.context.globalState.get(
        appStateKeys.allPackages(),
        []
      )

      const packageName = await vscode.window.showInputBox({
        placeHolder: 'com.domain.app.beta',
        value: lastvalue[0],
        ignoreFocusOut: true,
        validateInput: (str: string) => {
          if (str.length <= 4) {
            return 'Must be an valid package name (min length 4 characters)'
          }
          return undefined
        },
        prompt:
          'Enter the "PACKAGE.NAME" from your APP to enable. (Last name will be filled in next time, make sure your device is connected)'
      })

      vscode.window.showInformationMessage(
        await this.firebaseInstance.enableFirebaseDebugView(packageName)
      )
    } catch (e) {
      this.genericErrorReturn(e)
    }
  }
  async DisableFirebaseDebugView() {
    try {
      vscode.window.showInformationMessage(
        await this.firebaseInstance.disableFirebaseDebugView()
      )
    } catch (e) {
      this.genericErrorReturn(e)
    }
  }
}
