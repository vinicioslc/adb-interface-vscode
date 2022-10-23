// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import { ADBCommandsController } from './controllers/adb-controller'
import { ADBPathController } from './controllers/adb-path-controller'
import { FirebaseController } from './controllers/firebase-controller'

import { NetHelpers } from './domain/net-helpers'
import { ADBConnection } from './domain/adb-wrapper'
import { ADBPathManager } from './domain/adb-path-manager'
import { FirebaseManagerChannel } from './domain/firebase-channel'
import { ConsoleInterface } from './domain/console/console-interface'

const registered = {}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Register all controllers used by plugin
  const netHelper = new NetHelpers()
  registered['firebaseController'] = new FirebaseController(
    context,
    new FirebaseManagerChannel(new ConsoleInterface(), context.globalState)
  )
  registered['adbCmdController'] = new ADBCommandsController(
    context,
    new ADBConnection(new ConsoleInterface(), context.globalState, netHelper)
  )
  registered['adbPathController'] = new ADBPathController(
    context,
    new ADBPathManager(context.globalState)
  )
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('ADB INTERFACE DEACTIVATED')
}
