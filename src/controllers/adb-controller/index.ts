import * as vscode from 'vscode'
import { ADBConnection, ADBInterfaceException } from '../../domain/adb-wrapper'
import * as appStateKeys from '../../config/global-state-keys'
import { IPHelpers } from '../../domain/adb-wrapper/ip-helpers'
import { ADBBaseController } from './ADBBaseController'

export class ADBCommandsController extends ADBBaseController {
  private adbConnInstance: ADBConnection
  private appStateKeys: typeof appStateKeys
  get lastUsedIP(): string {
    return this.context.globalState.get(appStateKeys.lastUsedIP(), '')
  }

  get lastUsedPort(): string {
    return this.context.globalState.get(appStateKeys.lastUsedPort(), '5555')
  }

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
      await (vscode.window
        .showInputBox({
          placeHolder: '5555',
          value: this.lastUsedPort,
          ignoreFocusOut: true,
          prompt:
            'Enter the Port from your device to be used. (Last port used will be filled in next time)'
        })
        .then(async port => {
          await vscode.window.showInformationMessage(
            await this.adbConnInstance.ResetPorts(port)
          )
        }))
    } catch (e) {
      this.genericErrorReturn(e)
    }
  }

  async connectToDevice() {
    const ipValue = this.lastUsedIP

    // The code you place here will be executed every time your command is executed
    vscode.window
      .showInputBox({
        placeHolder: '192.168.0.1',
        value: ipValue,
        ignoreFocusOut: true,
        prompt:
          'Enter the IP Address from your device. (Last IP will be filled in next time) .'
      })
      .then(async ipAddress => {
        vscode.window
          .showInputBox({
            placeHolder: '5555',
            value: this.lastUsedPort,
            ignoreFocusOut: true,
            prompt:
              'Enter the Port from your device to be used. (Last port used will be filled in next time)'
          })
          .then(async port => {

            await this.connectToAdbDevice(this.context, ipAddress, port)
          })
      })
    // Display a message box to the user
  }

  async connectToAdbDevice(context: vscode.ExtensionContext, deviceIP: string, port: string) {
    if (port)
      await this.context.globalState.update(appStateKeys.lastUsedPort(), port)
    if (deviceIP)
      await this.context.globalState.update(appStateKeys.lastUsedIP(), deviceIP)
    try {
      vscode.window.showInformationMessage(`Connecting to ${deviceIP}:${port}`)

      vscode.window.showInformationMessage(
        await this.adbConnInstance.ConnectToDevice(deviceIP, port)
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
    const arrayFounded = await vscode.window.showOpenDialog({
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
      vscode.window.showInformationMessage('Searching')
      const ipAddressList = await this.getIPAddressList()
      let selectedIP = await vscode.window.showQuickPick(ipAddressList, {
        ignoreFocusOut: true,
        placeHolder: 'Select the IP address of the device to connect to...'
      })
      selectedIP = IPHelpers.extractIPRegex(selectedIP)
      if (selectedIP != null) {
        vscode.window
          .showInputBox({
            placeHolder: '5555',
            value: this.lastUsedPort,
            ignoreFocusOut: true,
            prompt:
              'Enter the Port from your device to be used. (Last port used will be filled in next time)'
          })
          .then(async port => {
            // wait disconnect from adb device
            await this.adbConnInstance.DisconnectFromAllDevices()
            await this.connectToAdbDevice(
              this.context,
              selectedIP,
              port
            )
          })
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
      const lastIPSelected = await this.lastUsedIP
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
