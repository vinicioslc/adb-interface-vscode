import * as vscode from 'vscode'
import { ExtController } from './ExtensionController'
import { ADBInterfaceException } from '../adb-wrapper'

export class ADBBaseController extends ExtController {
  genericErrorReturn(e: Error) {
    if (e instanceof ADBInterfaceException) {
      vscode.window.showWarningMessage(e.message)
    } else {
      vscode.window.showErrorMessage('Error:' + e.message)
    }
  }
}
