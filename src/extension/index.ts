import { ADBResultState, ADBChannel } from '../ADB-Interface'
import * as FirebaseExtension from '../firebase-actions'
import * as vscode from 'vscode'
import stateKeys from './global-state-keys'

import { ConsoleInterface } from '../console-interface'
const adbInstance = new ADBChannel(new ConsoleInterface())

export async function ResetDevicesPort() {
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Starting ADB'
    },
    async progress => {
      progress.report({ message: 'Reseting Ports to 5555', increment: 50 })
      var adbInterfaceResult = await adbInstance.ResetPorts()
      progress.report({ increment: 85 })
      switch (adbInterfaceResult.state) {
        case ADBResultState.NoDevices:
          vscode.window.showWarningMessage(adbInterfaceResult.message)
          break
        case ADBResultState.DevicesInPortMode:
          vscode.window.showInformationMessage(adbInterfaceResult.message)
          break
        default:
          vscode.window.showErrorMessage(adbInterfaceResult.message)
          break
      }
      return async () => {}
    }
  )
  // Display a message box to the user
}

export async function ConnectToDevice(context: vscode.ExtensionContext) {
  let lastvalue = context.globalState.get(stateKeys.lastIPUsed, '')
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
      connectToAdbDevice(context, value)
    })
  // Display a message box to the user
}

function connectToAdbDevice(context: vscode.ExtensionContext, value: string) {
  context.globalState.update(stateKeys.lastIPUsed, value)
  try {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Starting ADB'
      },
      async progress => {
        progress.report({ message: `Connecting to ${value}`, increment: 50 })
        var adbInterfaceResult = await adbInstance.ConnectToDevice(value)
        progress.report({ increment: 85 })
        switch (adbInterfaceResult.state) {
          case ADBResultState.NoDevices:
            vscode.window.showWarningMessage(adbInterfaceResult.message)
            break
          case ADBResultState.ConnectionRefused:
            vscode.window.showWarningMessage(adbInterfaceResult.message)
            break
          case ADBResultState.AllreadyConnected:
            vscode.window.showWarningMessage(adbInterfaceResult.message)
            break
          case ADBResultState.Error:
            vscode.window.showErrorMessage(adbInterfaceResult.message)
            break
          case ADBResultState.ConnectedToDevice:
            vscode.window.showInformationMessage(adbInterfaceResult.message)
            break
          default:
            vscode.window.showWarningMessage(adbInterfaceResult.message)
            break
        }
        return async () => {}
      }
    )
  } catch (e) {
    vscode.window.showErrorMessage('Fail to connect to device\n' + e.message)
  }
}

export async function DisconnectAnyDevice() {
  try {
    const adbInterfaceResult = await adbInstance.DisconnectFromAllDevices()
    adbInterfaceResult.state
    switch (adbInterfaceResult.state) {
      case ADBResultState.DisconnectedEverthing:
        vscode.window.showInformationMessage(adbInterfaceResult.message)
        break
      default:
        vscode.window.showErrorMessage(
          'Fail to disconnect all devices\n' + adbInterfaceResult.message
        )
        break
    }
  } catch (e) {
    vscode.window.showErrorMessage(
      'Fail to disconnect all devices\n' + e.message
    )
  }
}

export async function ConnectToDeviceFromList(
  context: vscode.ExtensionContext
) {
  const adbInterfaceResult = await adbInstance.DisconnectFromAllDevices()
  let items = adbInstance.GetConnectedDevices()
  let result = await vscode.window.showQuickPick(items, {
    ignoreFocusOut: true,
    placeHolder: 'Enter the IP address from your device to connect to him.'
  })
  connectToAdbDevice(context, adbInstance.extractIPAddress(result))
}

export async function KillADBServer() {
  const adbInterfaceResult = await adbInstance.KillADBServer()
  if (adbInterfaceResult.state == ADBResultState.Success) {
    vscode.window.showInformationMessage(adbInterfaceResult.message)
  } else {
    vscode.window.showErrorMessage(
      'Fail to Kill ADB interface' + adbInterfaceResult.message
    )
  }
}

export async function EnableFirebaseDebugView(
  context: vscode.ExtensionContext
) {
  try {
    let lastvalue = context.globalState.get(stateKeys.allPackages, [])

    let packageName = await vscode.window.showInputBox({
      placeHolder: 'com.yourapp.domain',
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

    let adbInterfaceResult = FirebaseExtension.enableFirebaseDebugView(
      packageName
    )
    switch (adbInterfaceResult.state) {
      case ADBResultState.Success:
        vscode.window.showInformationMessage(adbInterfaceResult.message)
        break
      default:
        vscode.window.showErrorMessage(
          'Fail to enable debug \n' + adbInterfaceResult.message
        )
        break
    }
  } catch (e) {
    vscode.window.showErrorMessage('Fail to connect to device \n' + e.message)
  }
}

export async function DisableFirebaseDebugView(
  context: vscode.ExtensionContext
) {
  try {
    let adbInterfaceResult = FirebaseExtension.disableFirebaseDebugView()
    switch (adbInterfaceResult.state) {
      case ADBResultState.Success:
        vscode.window.showInformationMessage(adbInterfaceResult.message)
        break
      default:
        vscode.window.showErrorMessage(
          'Fail to disable debug \n' + adbInterfaceResult.message
        )
        break
    }
  } catch (e) {
    vscode.window.showErrorMessage('Fail to connect to device \n' + e.message)
  }
}
