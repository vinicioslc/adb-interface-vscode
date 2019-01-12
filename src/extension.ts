// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const execSync = require('child_process').execSync;
const LastIPAddressKey = 'lastIPAddress';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Adb extension loaded')

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.adbwificonnect', () => {
		let lastvalue = context.globalState.get(LastIPAddressKey, '');
		// The code you place here will be executed every time your command is executed
		vscode.window.showInputBox(
			{
				placeHolder: "192.168.0.1",
				value: lastvalue,
				ignoreFocusOut: true,
				prompt: 'Enter the IP address from your device to connect to him. (Last address will be filled in next time)'
			}
		).then((value) => {
			try {
				context.globalState.update(LastIPAddressKey, value);
				var result = execSync('adb connect ' + value)
				vscode.window.showInformationMessage('Success connected to device')
			}
			catch (e) {
				if (e.message.includes('Command failed')) {
					vscode.window.showErrorMessage('The plugin needs ADB tool added to enviroment variables correctly.')
				}
				else {
					vscode.window.showErrorMessage('Fail to connect to device\n' + e.message)
				}
				console.log(JSON.stringify(e));
			}
		})
		// Display a message box to the user
	});

	context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() { }
