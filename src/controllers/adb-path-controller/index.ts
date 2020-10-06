import * as vscode from 'vscode'
import * as path from 'path'
import { ADBInterfaceException } from '../../domain/adb-wrapper'
import * as appStateKeys from '../../config/global-state-keys'
import { ADBBaseController } from '../adb-controller/ADBBaseController'
import { ADBPathManager } from '../../domain/adb-path-manager/index'

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
        openLabel: 'Select the ADB Executable',
        filters: {
          'ADB Executable': ['exe', '*']
        }
      }

      vscode.window.showOpenDialog(options).then(fileUri => {
        if (fileUri && fileUri[0]) {
          // replace filename with path
          const adbPath = fileUri[0].fsPath.replace(
            RegExp(path.basename(fileUri[0].fsPath) + '$', 'i'),
            ''
          )

          this.pathManagerInstance.setFilePath(adbPath)
          vscode.window.showInformationMessage(
            'Custom ADB path configured:' + adbPath
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
