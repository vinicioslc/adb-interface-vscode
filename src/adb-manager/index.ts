import { NetHelpers } from '../ip-helpers'

import adbCommands from './adb-commands'
import { ConsoleChannel } from '../console-channel'
import adbReturns from './adb-returns'
import adbMessages from './adb-messages'
import helpers from './helpers'

export class ADBChannel extends ConsoleChannel {
  /**
   *  connect to a given ip address
   * @param deviceIPAddress "192.168.1.100"
   */
  ConnectToDevice(deviceIPAddress: string): ADBResult {
    deviceIPAddress = helpers.extractIPRegex(deviceIPAddress)

    let finalResult = new ADBResult(
      ADBResultState.Error,
      'Some error ocurred during connection'
    )

    const result = this.consoleInterface.execConsoleSync(
      adbCommands.CONNECT_IP_AND_PORT(deviceIPAddress)
    )
    const output: string = result.toLocaleString()

    const deviceName = this.getDeviceName(deviceIPAddress)

    if (output.includes('connected to')) {
      finalResult = new ADBResult(
        ADBResultState.ConnectedToDevice,
        `Connected to: ${deviceName}`
      )
    }
    if (output.includes('already connected to')) {
      finalResult = new ADBResult(
        ADBResultState.AllreadyConnected,
        `Allready connected to device ${deviceName}`
      )
    }
    if (output.includes('(10061)')) {
      finalResult = new ADBResult(
        ADBResultState.ConnectionRefused,
        'Connection refused:\n Target machine actively refused connection.'
      )
    }

    return finalResult
  }
  async ResetPorts(): Promise<ADBResult> {
    var finalResult = new ADBResult(
      ADBResultState.Error,
      'Error while reset TCPIP Ports'
    )
    try {
      const result = this.consoleInterface.execConsoleSync(
        adbCommands.RESET_PORTS()
      )
      const output = result.toLocaleString()
      if (output.includes(adbReturns.RESTARTING_PORT())) {
        finalResult = new ADBResult(
          ADBResultState.DevicesInPortMode,
          adbMessages.DEVICES_IN_TCP_MODE()
        )
      }
    } catch (e) {
      if (e.message.includes('no devices/emulators found')) {
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

  getDeviceName(deviceIP: string): string {
    return this.consoleInterface
      .execConsoleSync(adbCommands.SHELL_GETPROP_ROPRODUCTMODEL(deviceIP))
      .toString()
  }

  async DisconnectFromAllDevices(): Promise<ADBResult> {
    var finalResult = new ADBResult(
      ADBResultState.Error,
      'Error while reset TCPIP Ports'
    )
    try {
      const result = this.consoleInterface.execConsoleSync(
        adbCommands.ADB_DISCONNECT_ALL()
      )
      const output = result.toLocaleString()
      if (output.includes('disconnected everything')) {
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
  /**
   * Returns if the ipAddress contains some ip address pattern
   * @param ipAddress string to test
   */
  testIP(ipAddress: string): Boolean {
    const regexIP = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1}\.[0-9]{1,3})/gim
    return regexIP.test(ipAddress)
  }
  async GetConnectedDevices(): Promise<Array<string>> {
    var devicesArray = []
    try {
      const result = this.consoleInterface.execConsoleSync(
        adbCommands.ADB_DEVICES()
      )
      const output = result.toLocaleString()
      if (output.includes('List of devices attached')) {
        let ips = output.split(/[\r]|[\n]/gim)
        ips = ips.filter(ip => this.testIP(ip))
        ips = ips.map(ipAddress => {
          const nameOfDevice = this.getDeviceName(
            helpers.extractIPRegex(ipAddress)
          )
          return `${ipAddress} | ${nameOfDevice}`
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
      const result = this.consoleInterface.execConsoleSync(
        adbCommands.ADB_KILL_SERVER()
      )
      if (result.toLocaleString() === '') {
        returned = new ADBResult(ADBResultState.Success, 'ADB Server killed')
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
