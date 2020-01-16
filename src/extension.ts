// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import {
  ResetDevicesPort,
  DisconnectAnyDevice,
  ConnectToDevice,
  ConnectToDeviceFromList,
  EnableFirebaseDebugView,
  DisableFirebaseDebugView,
  KillADBServer
} from './extension/index'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const commands = [
    {
      name: 'adbInterface.adbwificonnect',
      callback: () => {
        return ConnectToDevice(context)
      }
    },
    {
      name: 'adbInterface.adbResetPorts',
      callback: () => {
        return ResetDevicesPort(context)
      }
    },
    {
      name: 'adbInterface.disconnectEverthing',
      callback: () => {
        return DisconnectAnyDevice(context)
      }
    },
    {
      name: 'adbInterface.connectToDeviceFromList',
      callback: () => {
        return ConnectToDeviceFromList(context)
      }
    },
    {
      name: 'adbInterface.enableFirebaseDebug',
      callback: () => {
        return EnableFirebaseDebugView(context)
      }
    },
    {
      name: 'adbInterface.disableFirebaseDebug',
      callback: () => {
        return DisableFirebaseDebugView(context)
      }
    },
    {
      name: 'adbInterface.killserver',
      callback: () => {
        return KillADBServer(context)
      }
    }
  ]
  for (const command of commands) {
    let subscription = vscode.commands.registerCommand(
      command.name,
      command.callback
    )
    context.subscriptions.push(subscription)
  }
  return
}

// this method is called when your extension is deactivated
export function deactivate() {}
