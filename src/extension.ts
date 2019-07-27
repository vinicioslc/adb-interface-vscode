// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import {
  ResetDevicesPort,
  DisconnectAnyDevice,
  ConnectToDevice,
  ConnectToDeviceFromList,
  EnableFirebaseDebugView,
  DisableFirebaseDebugView
} from './extension/index'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const registrar = [
    {
      name: 'adbInterface.adbwificonnect',
      callback: () => ConnectToDevice(context)
    },
    { name: 'adbInterface.adbResetPorts', callback: () => ResetDevicesPort() },
    {
      name: 'adbInterface.disconnectEverthing',
      callback: () => DisconnectAnyDevice()
    },
    {
      name: 'adbInterface.connectToDeviceFromList',
      callback: () => ConnectToDeviceFromList(context)
    },
    {
      name: 'adbInterface.enableFirebaseDebug',
      callback: () => EnableFirebaseDebugView(context)
    },
    {
      name: 'adbInterface.disableFirebaseDebug',
      callback: () => DisableFirebaseDebugView(context)
    }
  ]

  for (const register of registrar) {
    let subscription = vscode.commands.registerCommand(
      register.name,
      register.callback
    )
    context.subscriptions.push(subscription)
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
