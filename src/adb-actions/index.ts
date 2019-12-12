import { execSync } from 'child_process'
import { NetHelpers } from '../ip-helpers'
import { IConsoleInterface } from '../console-interface/iconsole-interface'
import { stringLiteral } from '@babel/types'
import { log } from 'util'
import adbCommands from './adb-shell-commands'

export class ADBInterface {
  consoleInterface: IConsoleInterface
  constructor(consoleInterface: IConsoleInterface) {
    this.consoleInterface = consoleInterface
  }
  ConnectToDevice(deviceIP: string): ADBResult {
    deviceIP = this.extractIPAddress(deviceIP)

    var finalResult = new ADBResult(
      ADBResultState.Error,
      'Some error ocurred during connection'
    )

    const result = this.consoleInterface.execConsoleSync(
      `adb connect ${deviceIP}:5555`
    )

    const output: String = result.toLocaleString()

    if (output.includes('connected to')) {
      finalResult = new ADBResult(
        ADBResultState.ConnectedToDevice,
        `Connected to device ${this.getDeviceName(deviceIP)}`
      )
    }
    if (output.includes('already connected to')) {
      finalResult = new ADBResult(
        ADBResultState.AllreadyConnected,
        `Allready connected to device ${this.getDeviceName(deviceIP)}`
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
      const result = this.consoleInterface.execConsoleSync(`adb tcpip 5555`)
      const output = result.toLocaleString()
      if (output.includes('restarting in TCP mode port: 5555')) {
        finalResult = new ADBResult(
          ADBResultState.DevicesInPortMode,
          'Devices in TCP mode port: 5555'
        )
      }
    } catch (e) {
      if (e.message.includes('no devices/emulators found')) {
        finalResult = new ADBResult(
          ADBResultState.NoDevices,
          'No devices found or conected'
        )
      } else finalResult = new ADBResult(ADBResultState.Error, e.message)
    }
    return finalResult
  }

  getDeviceName(deviceIP: string): string {
    const result = this.consoleInterface
      .execConsoleSync(`adb -s ${deviceIP} shell getprop ro.product.model`)
      .toString()
    return result
  }

  firebaseEventsDebug({ package_name }): string {
    const result = this.consoleInterface
      .execConsoleSync(
        `adb shell setprop debug.firebase.analytics.app ${package_name}`
      )
      .toString()
    return result
  }

  disableFirebaseEventsDebug(): string {
    const result = this.consoleInterface
      .execConsoleSync(`adb shell setprop debug.firebase.analytics.app .none.`)
      .toString()
    return result
  }

  async DisconnectFromAllDevices(): Promise<ADBResult> {
    var finalResult = new ADBResult(
      ADBResultState.Error,
      'Error while reset TCPIP Ports'
    )
    try {
      const result = this.consoleInterface.execConsoleSync(`adb disconnect`)
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
        adbCommands.ADB_DEVICES
      )
      const output = result.toLocaleString()
      if (output.includes('List of devices attached')) {
        let ips = output.split(/[\r]|[\n]/gim)
        ips = ips.filter(ip => this.testIP(ip))
        ips = ips.map(ipAddress => {
          let nameOfDevice = this.getDeviceName(
            this.extractIPAddress(ipAddress)
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

  extractIPAddress(ipAddress: string): string {
    const regexIP = /([\d]+\.[\d]+\.[\d]+\.[\d]+)/gim
    var matches = regexIP.exec(ipAddress) || ['']
    return matches[0]
  }

  async KillADBServer(): Promise<ADBResult> {
    let returned = new ADBResult(ADBResultState.Error, 'Fail during ADB Kill')
    try {
      const result = this.consoleInterface.execConsoleSync(
        adbCommands.ADB_KILL_SERVER
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
  message = 'ADB Device not found in this machine'
}
