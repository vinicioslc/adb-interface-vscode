"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const index_1 = require("./extension/index");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let connectToDeviceAction = vscode.commands.registerCommand('adbInterface.adbwificonnect', () => index_1.ConnectToDevice(context));
    context.subscriptions.push(connectToDeviceAction);
    let resetTCPPortAction = vscode.commands.registerCommand('adbInterface.adbResetPorts', () => index_1.ResetPort());
    context.subscriptions.push(resetTCPPortAction);
    let disconnectDevicesAction = vscode.commands.registerCommand('adbInterface.disconnectEverthing', () => index_1.DisconnectAnyDevice());
    context.subscriptions.push(disconnectDevicesAction);
    let connectToDeviceFromListAction = vscode.commands.registerCommand('adbInterface.connectToDeviceFromList', () => index_1.ConnectToDeviceFromList(context));
    context.subscriptions.push(connectToDeviceFromListAction);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map