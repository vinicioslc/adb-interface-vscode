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
const adb_interface_1 = require("../adb-interface/adb-interface");
const vscode = require("vscode");
function ResetPort() {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Starting ADB"
        }, (progress) => __awaiter(this, void 0, void 0, function* () {
            progress.report({ message: "Reseting Ports to 5555", increment: 50 });
            var adbInterfaceResult = yield adb_interface_1.ADBInterface.ResetPorts();
            progress.report({ increment: 85 });
            switch (adbInterfaceResult.state) {
                case adb_interface_1.ADBResultState.NoDevices:
                    vscode.window.showWarningMessage(adbInterfaceResult.message);
                    break;
                case adb_interface_1.ADBResultState.DevicesInPortMode:
                    vscode.window.showInformationMessage(adbInterfaceResult.message);
                    break;
                default:
                    vscode.window.showErrorMessage(adbInterfaceResult.message);
                    break;
            }
            return () => __awaiter(this, void 0, void 0, function* () { });
        }));
        // Display a message box to the user
    });
}
exports.ResetPort = ResetPort;
const LastIPAddressKey = 'lastIPAddress';
function ConnectToDevice(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastvalue = context.globalState.get(LastIPAddressKey, '');
        // The code you place here will be executed every time your command is executed
        vscode.window.showInputBox({
            placeHolder: "192.168.0.1",
            value: lastvalue,
            ignoreFocusOut: true,
            prompt: 'Enter the IP address from your device to connect to him. (Last address will be filled in next time) port 5555 added automagically.'
        }).then((value) => __awaiter(this, void 0, void 0, function* () {
            connectToAdbDevice(context, value);
        }));
        // Display a message box to the user
    });
}
exports.ConnectToDevice = ConnectToDevice;
function connectToAdbDevice(context, value) {
    context.globalState.update(LastIPAddressKey, value);
    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Starting ADB"
        }, (progress) => __awaiter(this, void 0, void 0, function* () {
            progress.report({ message: `Connecting to ${value}`, increment: 50 });
            var adbInterfaceResult = yield adb_interface_1.ADBInterface.ConnectToDevice(value);
            progress.report({ increment: 85 });
            switch (adbInterfaceResult.state) {
                case adb_interface_1.ADBResultState.NoDevices:
                    vscode.window.showWarningMessage(adbInterfaceResult.message);
                    break;
                case adb_interface_1.ADBResultState.ConnectionRefused:
                    vscode.window.showWarningMessage(adbInterfaceResult.message);
                    break;
                case adb_interface_1.ADBResultState.AllreadyConnected:
                    vscode.window.showWarningMessage(adbInterfaceResult.message);
                    break;
                case adb_interface_1.ADBResultState.Error:
                    vscode.window.showErrorMessage(adbInterfaceResult.message);
                    break;
                case adb_interface_1.ADBResultState.ConnectedToDevice:
                    vscode.window.showInformationMessage(adbInterfaceResult.message);
                    break;
                default:
                    vscode.window.showWarningMessage(adbInterfaceResult.message);
                    break;
            }
            return () => __awaiter(this, void 0, void 0, function* () { });
        }));
    }
    catch (e) {
        vscode.window.showErrorMessage('Fail to connect to device\n' + e.message);
    }
}
function DisconnectAnyDevice() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const adbInterfaceResult = yield adb_interface_1.ADBInterface.DisconnectFromAllDevices();
            adbInterfaceResult.state;
            switch (adbInterfaceResult.state) {
                case adb_interface_1.ADBResultState.DisconnectedEverthing:
                    vscode.window.showInformationMessage(adbInterfaceResult.message);
                    break;
                default:
                    vscode.window.showErrorMessage('Fail to disconnect all devices\n' + adbInterfaceResult.message);
                    break;
            }
        }
        catch (e) {
            vscode.window.showErrorMessage('Fail to disconnect all devices\n' + e.message);
        }
    });
}
exports.DisconnectAnyDevice = DisconnectAnyDevice;
function ConnectToDeviceFromList(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let items = adb_interface_1.ADBInterface.GetConnectedDevices();
        let result = yield vscode.window.showQuickPick(items, {
            ignoreFocusOut: true,
            placeHolder: "Enter the IP address from your device to connect to him.",
        });
        connectToAdbDevice(context, adb_interface_1.ADBInterface.extractIPAddress(result));
    });
}
exports.ConnectToDeviceFromList = ConnectToDeviceFromList;
//# sourceMappingURL=index.js.map