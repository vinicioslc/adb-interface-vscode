import * as vscode from 'vscode'
import { ExtController } from './ExtensionController'
import { ADBInterfaceException } from '../infraestructure/adb-wrapper'

export class ADBBaseController extends ExtController {
  async genericErrorReturn(e: Error) {
    if (e instanceof ADBInterfaceException) {
      vscode.window.showWarningMessage(e.message)
    } else {
      vscode.window.showErrorMessage('Error:' + e.message)
    }
  }
}
