import {
  ADBResultState,
  ADBConnection,
  ADBInterfaceException,
  ADBResult
} from '../adb-wrapper'
import { FirebaseManagerChannel } from '../firebase-actions'
import * as vscode from 'vscode'

import { ConsoleInterface } from '../console/console-interface'
import * as appStateKeys from './global-state-keys'
import * as os from 'os'
import { IPHelpers } from '../adb-wrapper/ip-helpers'
import { ADBResolver, ADBNotFoundError } from '../adb-resolver'

const consoleInstance = new ConsoleInterface()
const firebaseInstance = new FirebaseManagerChannel(consoleInstance)
const adbInstance = new ADBConnection(consoleInstance)
function genericErrorReturn(e: Error) {
  if (e instanceof ADBInterfaceException) {
    vscode.window.showWarningMessage(e.message)
  } else {
    vscode.window.showErrorMessage('Error:' + e.message)
  }
}
export async function ResetDevicesPort(context: vscode.ExtensionContext) {
  try {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Starting ADB'
      },
      async progress => {
        try {
          progress.report({ message: 'Reseting ports to 5555', increment: 50 })
          let adbInterfaceResult = await adbInstance.ResetPorts()
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
          genericErrorReturn(e)
        }
      }
    )
    // Display a message box to the user
  } catch (e) {
    genericErrorReturn(e)
  }
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
      await connectToAdbDevice(context, value)
    })
  // Display a message box to the user
}

async function connectToAdbDevice(
  context: vscode.ExtensionContext,
  value: string
) {
  context.globalState.update(appStateKeys.lastIPUsed(), value)
  try {
    vscode.window.showInformationMessage('Connecting throught IP')
    vscode.window.showInformationMessage(`Connecting to ${value}`)
    let adbInterfaceResult = await adbInstance.ConnectToDevice(value)

    switch (adbInterfaceResult.state) {
      case ADBResultState.NoDevices:
        vscode.window.showWarningMessage(adbInterfaceResult.message)
        break
      case ADBResultState.AllreadyConnected:
        vscode.window.showWarningMessage(adbInterfaceResult.message)
        break
      case ADBResultState.ConnectedToDevice:
        vscode.window.showInformationMessage(adbInterfaceResult.message)
        break
      default:
        vscode.window.showWarningMessage(adbInterfaceResult.message)
        break
    }
  } catch (e) {
    genericErrorReturn(e)
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
    genericErrorReturn(e)
  }
}
export async function KillADBServer(context: vscode.ExtensionContext) {
  try {
    const adbInterfaceResult = await adbInstance.KillADBServer()
    if (adbInterfaceResult.state == ADBResultState.Success) {
      vscode.window.showInformationMessage(adbInterfaceResult.message)
    } else {
      vscode.window.showErrorMessage(
        'Fail to Kill ADB interface' + adbInterfaceResult.message
      )
    }
  } catch (e) {
    genericErrorReturn(e)
  }
}

export async function ConnectToDeviceFromList(
  context: vscode.ExtensionContext
) {
  try {
    const ipAddresses = await getIPAddressList(context)
    const ipSelected = await vscode.window.showQuickPick(ipAddresses, {
      ignoreFocusOut: true,
      placeHolder: 'Select the IP address of the device to connect to...'
    })
    if (ipSelected == null) {
      throw new Error('Device IP Address not selected.')
    } else {
      // wait disconnect from adb device
      await adbInstance.DisconnectFromAllDevices()
      await connectToAdbDevice(context, IPHelpers.extractIPRegex(ipSelected))
    }
  } catch (error) {
    genericErrorReturn(error)
  }
}

async function getIPAddressList(context) {
  try {
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
  } catch (e) {
    genericErrorReturn(e)
  }
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
    genericErrorReturn(e)
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
    genericErrorReturn(e)
  }
}
