import {
  ADBResultState,
  ADBChannel as ADBManagerChannel,
  ADBInterfaceException
} from '../adb-manager'
import { FirebaseManagerChannel } from '../firebase-actions'
import * as vscode from 'vscode'

import { ConsoleInterface } from '../console-interface'
import * as appStateKeys from './global-state-keys'
import { IPHelpers } from '../adb-manager/ip-helpers'

const cInterface = new ConsoleInterface()

const firebaseInstance = new FirebaseManagerChannel(cInterface)
const adbInstance = new ADBManagerChannel(cInterface)

export async function ResetDevicesPort(context: vscode.ExtensionContext) {
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Starting ADB'
    },
    async progress => {
      try {
        progress.report({ message: 'Reseting ports to 5555', increment: 50 })
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
      } catch (e) {
        vscode.window.showErrorMessage('ADB Interface: ' + e.message)
      }
    }
  )
  // Display a message box to the user
}

export async function ConnectToDevice(context: vscode.ExtensionContext) {
  let lastvalue = context.globalState.get(appStateKeys.lastIPUsed(), '')
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
  context.globalState.update(appStateKeys.lastIPUsed(), value)
  try {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Connecting ADB IP'
      },
      async progress => {
        await progress.report({
          message: `Connecting to ${value}`,
          increment: 50
        })
        var adbInterfaceResult = await adbInstance.ConnectToDevice(value)
        await progress.report({ increment: 85 })
        switch (adbInterfaceResult.state) {
          case ADBResultState.NoDevices:
            await vscode.window.showWarningMessage(adbInterfaceResult.message)
            break
          case ADBResultState.AllreadyConnected:
            await vscode.window.showWarningMessage(adbInterfaceResult.message)
            break
          case ADBResultState.ConnectedToDevice:
            await vscode.window.showInformationMessage(
              adbInterfaceResult.message
            )
            break
          default:
            await vscode.window.showWarningMessage(adbInterfaceResult.message)
            break
        }
        return async () => {}
      }
    )
  } catch (e) {
    if (e instanceof ADBInterfaceException) {
      vscode.window.showWarningMessage(e.message)
    } else {
      vscode.window.showErrorMessage('Error:' + e.message)
    }
  }
}

export async function DisconnectAnyDevice(context: vscode.ExtensionContext) {
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
export async function KillADBServer(context: vscode.ExtensionContext) {
  const adbInterfaceResult = await adbInstance.KillADBServer()
  if (adbInterfaceResult.state == ADBResultState.Success) {
    vscode.window.showInformationMessage(adbInterfaceResult.message)
  } else {
    vscode.window.showErrorMessage(
      'Fail to Kill ADB interface' + adbInterfaceResult.message
    )
  }
}

export async function ConnectToDeviceFromList(
  context: vscode.ExtensionContext
) {
  const ipAddresses = await getIPAddressList(context)
  const ipSelected = await vscode.window.showQuickPick(ipAddresses, {
    ignoreFocusOut: true,
    placeHolder: 'Select the IP address of the device to connect to...'
  })
  if (ipSelected == null) {
    vscode.window.showErrorMessage('Device IP Address not selected.')
  } else {
    // wait disconnect from adb device
    await adbInstance.DisconnectFromAllDevices()
    connectToAdbDevice(context, IPHelpers.extractIPRegex(ipSelected))
  }
}

async function getIPAddressList(context) {
  const connectedDevices = await adbInstance.FindConnectedDevices()
  const lastIPSelected = await context.globalState.get(
    appStateKeys.lastIPUsed,
    ''
  )
  if (lastIPSelected != null && lastIPSelected != '') {
    // add last selected ip to begining of array
    connectedDevices.unshift(lastIPSelected)
  }
  return connectedDevices
}
export async function EnableFirebaseDebugView(
  context: vscode.ExtensionContext
) {
  try {
    let lastvalue = context.globalState.get(appStateKeys.allPackages(), [])

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

    let adbInterfaceResult = firebaseInstance.enableFirebaseDebugView(
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
    let adbInterfaceResult = firebaseInstance.disableFirebaseDebugView()
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
