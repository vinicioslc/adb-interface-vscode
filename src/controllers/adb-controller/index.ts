import * as vscode from 'vscode'
import { ADBConnection, ADBInterfaceException } from '../../domain/adb-wrapper'
import * as appStateKeys from '../../config/global-state-keys'
import { IPHelpers } from '../../domain/adb-wrapper/ip-helpers'
import { ADBBaseController } from './ADBBaseController'
import { Memento } from 'vscode'

export class ADBCommandsController extends ADBBaseController {
  private adbConnInstance: ADBConnection
  private appStateKeys: typeof appStateKeys

  constructor(context: vscode.ExtensionContext, adbInstance: ADBConnection) {
    super(context)
    this.adbConnInstance = adbInstance
    this.appStateKeys = appStateKeys
  }
  async onInit() {
    this.registerCommand('adbInterface.adbwificonnect', () =>
      this.connectToDevice()
    )
      .registerCommand('adbInterface.adbResetPorts', () =>
        this.resetDevicesPort()
      )
      .registerCommand('adbInterface.disconnectEverthing', () =>
        this.disconnectAnyDevice()
      )
      .registerCommand('adbInterface.connectToDeviceFromList', () =>
        this.connectToDeviceFromList()
      )
      .registerCommand('adbInterface.killserver', () => this.killADBServer())

      .registerCommand('adbInterface.installAPKFile', () =>
        this.pickAPKAndInstall()
      )
  }

  async genericErrorReturn(e: Error) {
    super.genericErrorReturn(e)
  }
  async resetDevicesPort() {
    try {
      vscode.window.showInformationMessage(
        await this.adbConnInstance.ResetPorts()
      )
    } catch (e) {
      this.genericErrorReturn(e)
    }
  }

  async connectToDevice() {
    let lastvalue = this.context.globalState.get(appStateKeys.lastIPUsed(), '')
    // The code you place here will be executed every time your command is executed
    vscode.window
      .showInputBox({
        placeHolder: '192.168.0.1',
        value: lastvalue,
        ignoreFocusOut: true,
        prompt:
          'Enter the IP address from your device to connect to him. (Last address will be filled in next time) port 5555 added automagically.'
      })
      .then(async value => {
        await this.connectToAdbDevice(this.context, value)
      })
    // Display a message box to the user
  }

  async connectToAdbDevice(context: vscode.ExtensionContext, value: string) {
    context.globalState.update(appStateKeys.lastIPUsed(), value)
    try {
      vscode.window.showInformationMessage(`Connecting to ${value} by IP`)

      vscode.window.showInformationMessage(
        await this.adbConnInstance.ConnectToDevice(value)
      )
    } catch (e) {
      this.genericErrorReturn(e)
    }
  }

  async disconnectAnyDevice() {
    try {
      vscode.window.showInformationMessage(
        await this.adbConnInstance.DisconnectFromAllDevices()
      )
    } catch (e) {
      this.genericErrorReturn(e)
    }
  }
  async killADBServer() {
    try {
      const adbInterfaceResult = await this.adbConnInstance.KillADBServer()
      if (adbInterfaceResult) {
        vscode.window.showInformationMessage(adbInterfaceResult)
      } else {
        vscode.window.showErrorMessage('Fail to Kill:' + adbInterfaceResult)
      }
    } catch (e) {
      this.genericErrorReturn(e)
    }
  }
  async pickAPKAndInstall() {
    try {
      const filename = await this.findApkFile()
      console.error('filefound', filename)

      if (!filename) {
        throw new Error('Error: Invalid APK file selected')
      }
      const adbInterfaceResult = await this.adbConnInstance.InstallApkOnDevice(
        filename.toLocaleString()
      )

      if (adbInterfaceResult) {
        vscode.window.showInformationMessage(adbInterfaceResult)
      } else {
        vscode.window.showErrorMessage('Fail to Kill:' + adbInterfaceResult)
      }
    } catch (e) {
      this.genericErrorReturn(e)
    }
  }

  private async findApkFile() {
    let arrayFounded = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        'Android APK Files': ['apk']
      },
      openLabel: 'Select APK'
    })
    let filename: string = null
    for (const obj of arrayFounded) {
      if (obj.scheme == 'file') {
        filename = obj.path
        if (filename.startsWith('/')) filename = filename.substring(1)
      }
    }
    if (!filename) throw new ADBInterfaceException('Invalid APK file selected.')
    else {
      return filename
    }
  }

  async connectToDeviceFromList() {
    try {
      const ipAddresses = await this.getIPAddressList()
      const ipSelected = await vscode.window.showQuickPick(ipAddresses, {
        ignoreFocusOut: true,
        placeHolder: 'Select the IP address of the device to connect to...'
      })
      if (ipSelected != null) {
        // wait disconnect from adb device
        await this.adbConnInstance.DisconnectFromAllDevices()
        await this.connectToAdbDevice(
          this.context,
          IPHelpers.extractIPRegex(ipSelected)
        )
      } else {
        throw new Error('Device IP Address not selected.')
      }
    } catch (e) {
      this.genericErrorReturn(e)
    }
  }

  async getIPAddressList() {
    try {
      const connectedDevices = await this.adbConnInstance.FindConnectedDevices()
      const lastIPSelected = await this.context.globalState.get(
        this.appStateKeys.lastIPUsed(),
        ''
      )
      if (lastIPSelected != null && lastIPSelected != '') {
        // add last selected ip to begining of array
        connectedDevices.unshift(lastIPSelected)
      }
      return connectedDevices
    } catch (e) {
      this.genericErrorReturn(e)
    }
  }
}
