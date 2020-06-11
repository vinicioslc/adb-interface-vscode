// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { FirebaseController } from './controllers/firebase-controller'
import { FirebaseManagerChannel } from './firebase-channel'
import { ADBConnection } from './adb-wrapper'
import { ADBCommandsController } from './controllers/adb-controller'
import { ConsoleInterface } from './console/console-interface/index'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  let consoleInstance = new ConsoleInterface()
  let adbInstance = new ADBConnection(consoleInstance)
  let firebaseManagerChannel = new FirebaseManagerChannel(consoleInstance)

  const firebaseController = new FirebaseController(
    context,
    firebaseManagerChannel
  )
  const adbCmdController = new ADBCommandsController(context, adbInstance)
  adbCmdController
}

// this method is called when your extension is deactivated
export function deactivate() {}
