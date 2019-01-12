// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const execSync = require('child_process').execSync;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Adb extension loaded')

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.adbListener', () => {
		// The code you place here will be executed every time your command is executed
		try {
			var code = execSync('adb devices')
			vscode.window.showInputBox({ placeHolder: "" + code, }).then((stringas) => {

			})
			vscode.window.showInformationMessage('Success connected to device')
		}
		catch (e) {
			vscode.window.showErrorMessage('Fail to connect to device')
		}
		// Display a message box to the user
	});

	context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() { }
