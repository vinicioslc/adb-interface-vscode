"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const adb_interface_1 = require("./adb-interface/adb-interface");
const LastIPAddressKey = 'lastIPAddress';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Adb extension loaded');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.adbwificonnect', () => {
        let lastvalue = context.globalState.get(LastIPAddressKey, '');
        // The code you place here will be executed every time your command is executed
        vscode.window.showInputBox({
            placeHolder: "192.168.0.1",
            value: lastvalue,
            ignoreFocusOut: true,
            prompt: 'Enter the IP address from your device to connect to him. (Last address will be filled in next time)'
        }).then((value) => __awaiter(this, void 0, void 0, function* () {
            context.globalState.update(LastIPAddressKey, value);
            try {
                yield vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Connecting to device\n"
                }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
                    progress.report({ increment: 70 });
                    var result = yield adb_interface_1.ADBInterface.ConnectToDevice(value);
                    if (result.state == adb_interface_1.ADBResultState.ConnectionRefused) {
                        progress.report({ message: "Retrying Connection", increment: 70 });
                        result = yield adb_interface_1.ADBInterface.ConnectToDevice(value);
                        progress.report({ message: result.message, increment: 100 });
                    }
                    if (result.state == adb_interface_1.ADBResultState.Error)
                        yield vscode.window.showErrorMessage(result.message);
                    if (result.state == adb_interface_1.ADBResultState.ConnectionRefused) {
                        yield vscode.window.showWarningMessage(result.message);
                    }
                    return;
                }));
            }
            catch (e) {
                vscode.window.showErrorMessage('Fail to connect to device\n' + e.message);
            }
        }));
        // Display a message box to the user
    });
    let disposable2 = vscode.commands.registerCommand('extension.adbResetPorts', () => __awaiter(this, void 0, void 0, function* () {
        yield vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Connecting to device\n"
        }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
            progress.report({ increment: 70 });
            var result = yield adb_interface_1.ADBInterface.ResetPorts();
            yield vscode.window.showInformationMessage(result.message);
            return;
        }));
        // Display a message box to the user
    }));
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map