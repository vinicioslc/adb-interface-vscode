import { NetHelpers } from '../ip-helpers'

import adbCommands from './adb-commands'
import { ConsoleChannel } from '../console-channel'
import adbReturns from './adb-returns'
import adbMessages from './adb-messages'
import { IPHelpers, DeviceHelpers } from './helpers'

export class ADBChannel extends ConsoleChannel {
  /**
   *  connect to a given ip address
   * @param ipAddress "192.168.1.100"
   */
  ConnectToDevice(ipAddress: string): ADBResult {
    const deviceIP = IPHelpers.extractIPRegex(ipAddress)

    let finalResult = new ADBResult(
      ADBResultState.Error,
      'Some error ocurred during connection'
    )

    const result = this.consoleInstance.execConsoleSync(
      adbCommands.CONNECT_IP_AND_PORT(deviceIP)
    )
    const output = result.toString()
    const deviceName = DeviceHelpers.getDeviceModel(
      this.consoleInstance,
      deviceIP
    )

    if (output.includes(adbReturns.CONNECTED_TO())) {
      finalResult = new ADBResult(
        ADBResultState.ConnectedToDevice,
        `Connected to: ${deviceName}`
      )
    }
    if (output.includes(adbReturns.ALLREADY_CONNECTED_TO())) {
      finalResult = new ADBResult(
        ADBResultState.AllreadyConnected,
        `Allready connected to: ${deviceName}`
      )
    }
    if (output.includes(adbReturns.CONNECTION_REFUSED(deviceIP))) {
      finalResult = new ADBResult(
        ADBResultState.ConnectionRefused,
        'Connection refused:\n Target machine actively refused connection.'
      )
    }
    if (output.includes(adbReturns.MISSING_PORT(deviceIP))) {
      finalResult = new ADBResult(
        ADBResultState.Error,
        'ADB Fail : Port is missing fail to connect in ADB.'
      )
    }

    return finalResult
  }
  async ResetPorts(): Promise<ADBResult> {
    let finalResult = new ADBResult(
      ADBResultState.Error,
      'Error while reset TCP IP Ports'
    )
    try {
      const result = this.consoleInstance.execConsoleSync(
        adbCommands.RESET_PORTS()
      )
      const output = result.toString()
      if (output.includes(adbReturns.RESTARTING_PORT())) {
        finalResult = new ADBResult(
          ADBResultState.DevicesInPortMode,
          adbMessages.DEVICES_IN_TCP_MODE()
        )
      }
    } catch (e) {
      console.log()
      if (e.message.includes(adbReturns.NO_DEVICES_FOUND())) {
        finalResult = new ADBResult(
          ADBResultState.NoDevices,
          adbMessages.NO_DEVICES_FOUND()
        )
      } else {
        finalResult = new ADBResult(ADBResultState.Error, 'Error: ' + e.message)
      }
    }
    return finalResult
  }

  async DisconnectFromAllDevices(): Promise<ADBResult> {
    var finalResult = new ADBResult(
      ADBResultState.Error,
      'Error while reset TCPIP Ports'
    )
    try {
      const result = this.consoleInstance.execConsoleSync(
        adbCommands.ADB_DISCONNECT_ALL()
      )
      const output = result.toString()
      if (output.includes(adbReturns.DISCONNECTED_EVERTHING())) {
        finalResult = new ADBResult(
          ADBResultState.DisconnectedEverthing,
          'Disconnected from all devices'
        )
      }
    } catch (e) {
      finalResult = new ADBResult(ADBResultState.Error, e.message)
    }
    return finalResult
  }
  async FindConnectedDevices(): Promise<Array<string>> {
    var devicesArray = []
    try {
      const result = this.consoleInstance.execConsoleSync(
        adbCommands.LIST_ADB_DEVICES()
      )
      const output = result.toString()
      if (output.includes(adbReturns.LISTING_DEVICES())) {
        let ips = output.split(/[\r]|[\n]/gim)
        ips = ips.filter(ip => IPHelpers.isAnIPAddress(ip))
        ips = ips.map(ipAddress => {
          let deviceIP = IPHelpers.extractIPRegex(ipAddress)
          let nameOfDevice = DeviceHelpers.getDeviceModel(
            this.consoleInstance,
            deviceIP
          )
          return `${deviceIP} | ${nameOfDevice}`
        })
        // found devices on lan
        let moreips = await NetHelpers.getAllLanIPs()
        for (const variable of moreips) {
          ips.push(variable)
        }
        return ips
      }
    } catch (e) {}
    return devicesArray
  }

  async KillADBServer(): Promise<ADBResult> {
    let returned = new ADBResult(ADBResultState.Error, 'Fail during ADB Kill')
    try {
      const result = this.consoleInstance.execConsoleSync(
        adbCommands.ADB_KILL_SERVER()
      )
      if (result.toString() == adbReturns.ADB_KILLED_SUCCESS_RETURN()) {
        returned = new ADBResult(ADBResultState.Success, 'ADB Server killed')
      } else {
        throw Error('Internal error ocurred')
      }
    } catch (e) {
      returned.message = 'Fail \n ' + e.message
    }
    return returned
  }
}

/**
 * Is an enum of adb possible results
 */
export enum ADBResultState {
  ConnectedToDevice,
  ConnectionRefused,
  NotFound,
  NoDevices,
  Error,
  DevicesInPortMode,
  AllreadyConnected,
  DisconnectedEverthing,
  Success
}

/**
 * Is an result returned by an adb connection
 */
export class ADBResult {
  state: ADBResultState
  message: string
  constructor(resultState: ADBResultState, message: string) {
    this.state = resultState
    this.message = message
    return this
  }
}

export class ADBNotFoundError extends Error {
  message = adbMessages.ADB_DEVICE_NOT_FOUND()
}
