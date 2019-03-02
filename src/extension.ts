// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ADBInterface, ADBResultState } from "./adb-interface/adb-interface";


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
		).then(async (value) => {
			context.globalState.update(LastIPAddressKey, value);
			try {
				await vscode.window.withProgress(
					{
						location: vscode.ProgressLocation.Notification,
						title: "Connecting to device\n"
					},
					async (progress, token) => {
						progress.report({ increment: 70 });
						var result = await ADBInterface.ConnectToDevice(value)
						if (result.state == ADBResultState.ConnectionRefused) {
							progress.report({ message: "Retrying Connection", increment: 70 });
							result = await ADBInterface.ConnectToDevice(value)
							progress.report({ message: result.message, increment: 100 });
						}

						if (result.state == ADBResultState.Error)
							await vscode.window.showErrorMessage(result.message);
						if (result.state == ADBResultState.ConnectionRefused) {
							await vscode.window.showWarningMessage(result.message);
						}
						return;
					});
			} catch (e) {
				vscode.window.showErrorMessage('Fail to connect to device\n' + e.message);
			}
		})
		// Display a message box to the user
	});

	let disposable2 = vscode.commands.registerCommand('extension.adbResetPorts', async () => {

		await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: "Connecting to device\n"
			},
			async (progress, token) => {
				progress.report({ increment: 70 });
				var result = await ADBInterface.ResetPorts()

				await vscode.window.showInformationMessage(result.message);

				return;
			});
		// Display a message box to the user
	});
	context.subscriptions.push(disposable)
	context.subscriptions.push(disposable2)
}

// this method is called when your extension is deactivated
export function deactivate() { }
