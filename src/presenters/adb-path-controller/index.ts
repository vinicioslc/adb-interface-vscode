import * as vscode from 'vscode'
import * as path from 'path'
import { ADBInterfaceException } from '../../infraestructure/adb-wrapper'
import * as appStateKeys from '../../entities/global-state-keys'
import { ADBBaseController } from '../../infraestructure/ADBBaseController'
import { ADBPathManager } from '../../infraestructure/adb-path-manager/index'

export class ADBPathController extends ADBBaseController {
  appStateKeys: typeof appStateKeys
  pathManagerInstance: ADBPathManager

  constructor(
    context: vscode.ExtensionContext,
    adbPathManager: ADBPathManager
  ) {
    super(context)
    this.pathManagerInstance = adbPathManager
  }

  async genericErrorReturn(e: Error) {
    if (e instanceof ADBInterfaceException) {
      vscode.window.showWarningMessage(e.message)
    } else {
      vscode.window.showErrorMessage('Error:' + e.message)
    }
  }
  async onInit() {
    await this.registerCommand('adbInterface.setCustomADBPath', () =>
      this.setCustomADBPath()
    )
    await this.registerCommand('adbInterface.resetCustomADBPath', () =>
      this.resetCustomADBPath()
    )
  }

  setCustomADBPath(): any {
    try {
      const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        canSelectFiles: true,
        canSelectFolders: false,
        openLabel: 'Select your ADB Executable',
        filters: {
          'ADB Executable': ['*']
        }
      }

      vscode.window.showOpenDialog(options).then(fileUri => {
        if (fileUri && fileUri[0]) {
          // replace filename with path
          const adbPath = fileUri[0].fsPath.replace(
            RegExp(path.basename(fileUri[0].fsPath) + '$', 'i'),
            ''
          )
          console.log('Selected file: ' + fileUri[0].fsPath)
          console.log('Selected file: ' + adbPath)
          vscode.window.showInformationMessage(
            'Custom ADB path setted:' + adbPath
          )
        }
      })
    } catch (error) {
      this.genericErrorReturn(error)
    }
  }

  resetCustomADBPath(): any {
    try {
      this.pathManagerInstance.setFilePath(undefined)
      vscode.window.showInformationMessage('Custom ADB path removed')
    } catch (error) {
      this.genericErrorReturn(error)
    }
  }
}
