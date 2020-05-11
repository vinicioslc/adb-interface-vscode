import * as vscode from 'vscode'

import {
  ResetDevicesPort,
  DisconnectAnyDevice,
  ConnectToDevice,
  ConnectToDeviceFromList,
  EnableFirebaseDebugView,
  DisableFirebaseDebugView,
  KillADBServer
} from './extension/index'

export function commandsRegistry(vscodeContext: vscode.ExtensionContext) {
  return [
    {
      name: 'adbInterface.adbwificonnect',
      callback: () => {
        return ConnectToDevice(vscodeContext)
      }
    },
    {
      name: 'adbInterface.adbResetPorts',
      callback: () => {
        return ResetDevicesPort(vscodeContext)
      }
    },
    {
      name: 'adbInterface.disconnectEverthing',
      callback: () => {
        return DisconnectAnyDevice(vscodeContext)
      }
    },
    {
      name: 'adbInterface.connectToDeviceFromList',
      callback: () => {
        return ConnectToDeviceFromList(vscodeContext)
      }
    },
    {
      name: 'adbInterface.enableFirebaseDebug',
      callback: () => {
        return EnableFirebaseDebugView(vscodeContext)
      }
    },
    {
      name: 'adbInterface.disableFirebaseDebug',
      callback: () => {
        return DisableFirebaseDebugView(vscodeContext)
      }
    },
    {
      name: 'adbInterface.killserver',
      callback: () => {
        return KillADBServer(vscodeContext)
      }
    }
  ]
}
