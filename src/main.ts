// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { FirebaseController } from './presenters/firebase-controller'
import { ADBCommandsController } from './presenters/adb-controller'
import { ADBPathController } from './presenters/adb-path-controller'

import { FirebaseManagerChannel } from './infraestructure/firebase-channel'
import { ADBConnection } from './infraestructure/adb-wrapper'
import { ConsoleInterface } from './infraestructure/console/console-interface/index'
import { NetHelpers } from './infraestructure/net-helpers/index'
import { ADBPathManager } from './infraestructure/adb-path-manager'

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
export function deactivate() {}
