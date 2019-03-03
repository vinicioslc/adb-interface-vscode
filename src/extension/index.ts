import { ADBResultState, ADBInterface } from "../adb-interface/adb-interface";
import * as vscode from "vscode";

export async function ResetPort() {
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Starting ADB"
    },
    async (progress) => {
      progress.report({ message: "Reseting Ports to 5555", increment: 50 });
      var adbInterfaceResult = await ADBInterface.ResetPorts()
      progress.report({ increment: 85 });
      switch (adbInterfaceResult.state) {
        case ADBResultState.NoDevices:
          vscode.window.showWarningMessage(adbInterfaceResult.message);
          break;
        case ADBResultState.DevicesInPortMode:
          vscode.window.showInformationMessage(adbInterfaceResult.message);
          break;
        default:
          vscode.window.showErrorMessage(adbInterfaceResult.message);
          break;
      }
      return async () => { };
    });
  // Display a message box to the user
}

const LastIPAddressKey = 'lastIPAddress';

export async function ConnectToDevice(context: vscode.ExtensionContext) {
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
    connectToAdbDevice(context, value);
  })
  // Display a message box to the user
}

function connectToAdbDevice(context: vscode.ExtensionContext, value: string) {
  context.globalState.update(LastIPAddressKey, value);
  try {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Starting ADB"
    }, async (progress) => {
      progress.report({ message: `Connecting to ${value}`, increment: 50 });
      var adbInterfaceResult = await ADBInterface.ConnectToDevice(value);
      progress.report({ increment: 85 });
      switch (adbInterfaceResult.state) {
        case ADBResultState.NoDevices:
          vscode.window.showWarningMessage(adbInterfaceResult.message);
          break;
        case ADBResultState.ConnectionRefused:
          vscode.window.showWarningMessage(adbInterfaceResult.message);
          break;
        case ADBResultState.AllreadyConnected:
          vscode.window.showWarningMessage(adbInterfaceResult.message);
          break;
        case ADBResultState.Error:
          vscode.window.showErrorMessage(adbInterfaceResult.message);
          break;
        case ADBResultState.ConnectedToDevice:
          vscode.window.showInformationMessage(adbInterfaceResult.message);
          break;
        default:
          vscode.window.showWarningMessage(adbInterfaceResult.message);
          break;
      }
      return async () => { };
    });
  }
  catch (e) {
    vscode.window.showErrorMessage('Fail to connect to device\n' + e.message);
  }
}

export async function DisconnectAnyDevice() {
  try {
    const adbInterfaceResult = await ADBInterface.DisconnectFromAllDevices();
    adbInterfaceResult.state
    switch (adbInterfaceResult.state) {
      case ADBResultState.DisconnectedEverthing:
        vscode.window.showInformationMessage(adbInterfaceResult.message)
        break;
      default:
        vscode.window.showErrorMessage('Fail to disconnect all devices\n' + adbInterfaceResult.message);
        break;
    }
  } catch (e) {
    vscode.window.showErrorMessage('Fail to disconnect all devices\n' + e.message);
  }
}

export async function ConnectToDeviceFromList(context: vscode.ExtensionContext) {
  let items = ADBInterface.GetConnectedDevices();
  let result = await vscode.window.showQuickPick(items, {
    ignoreFocusOut: true,
    placeHolder: "Enter the IP address from your device to connect to him.",
  });
  connectToAdbDevice(context, ADBInterface.extractIPAddress(result));
}