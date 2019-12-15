// let ipv4PortRegex = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}):*[0-9]*/gim
import { IConsoleInterface } from './../console-interface/iconsole-interface'
import adbCommands from './adb-commands'
export class IPHelpers {
  static ipv4Regex = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/gim

  /**
   * Returns ip extracted from given text else not found  return null
   */
  static extractIPRegex(ipAddress: string): string {
    let returned = null
    let matches = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/gim.exec(
      ipAddress
    )
    if (matches != null && matches.length > 0) {
      returned = matches[0]
    } else {
      returned = null
    }
    return returned
  }

  /**
   * Returns if the ipAddress contains some ip address pattern
   * @param ipAddress string to test
   */
  static isAnIPAddress(ipAddress: string): Boolean {
    return /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/gim.test(ipAddress)
  }
}

export class DeviceHelpers {
  static getDeviceManufacturer(
    ConsoleInstance: IConsoleInterface,
    ipAddress: string
  ): string {
    return ConsoleInstance.execConsoleSync(
      adbCommands.GET_DEVICE_MODEL(ipAddress)
    ).toLocaleString()
  }

  static getDeviceModel(
    ConsoleInstance: IConsoleInterface,
    deviceIP: string
  ): string {
    return ConsoleInstance.execConsoleSync(
      adbCommands.GET_DEVICE_MODEL(deviceIP)
    ).toLocaleString()
  }
}
