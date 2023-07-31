import * as os from 'os'
import adbCommands from './adb-commands'
import {
  ConsoleInterfaceChannel,
  isValidReturn
} from '../console/console-interface-channel'
import adbReturns from './adb-returns'
import adbMessages from './adb-messages'
import { IPHelpers } from './ip-helpers'
import { INetHelpers } from '../net-helpers/net-helpers-interface'
import { ADBResolver } from '../adb-resolver'
import { IConsoleInterface } from '../console/console-interface/iconsole-interface'

export class ADBConnection extends ConsoleInterfaceChannel {
  private resolverInstance: ADBResolver
  private netHelpers: INetHelpers

  constructor(
    ciInstance: IConsoleInterface,
    currentStorage: any,
    netHelpers: INetHelpers
  ) {
    super(ciInstance)
    this.resolverInstance = new ADBResolver(
      os.homedir(),
      os.type(),
      ciInstance,
      currentStorage
    )
    this.netHelpers = netHelpers
  }

  /**
   *  connect to a given ip address
   * @param ipAddress "192.168.1.100"
   */
  public async ConnectToDevice(
    ipAddress: string,
    portAddress: string
  ): Promise<string> {
    let finalResult = null

    const deviceIP = IPHelpers.extractIPRegex(ipAddress)
    const resultString = (
      await this.resolverInstance.sendADBCommand(
        adbCommands.CONNECT_IP_AND_PORT(deviceIP, portAddress)
      )
    ).toString()

    if (isValidReturn(resultString, adbReturns.CONNECTED_TO())) {
      finalResult = `Connected to "${ipAddress}:${portAddress}"`
    }
    if (isValidReturn(resultString, adbReturns.ALREADY_CONNECTED_TO())) {
      throw new ADBInterfaceException(
        `Already connected to "${ipAddress}:${portAddress}"`
      )
    }
    if (isValidReturn(resultString, adbReturns.CONNECTION_REFUSED(deviceIP))) {
      throw new ADBInterfaceException(
        'Connection refused:\n s machine actively refused connection.'
      )
    }
    if (isValidReturn(resultString, adbReturns.MISSING_PORT(deviceIP))) {
      throw new ADBInterfaceException('Port is missing fail to connect in ADB.')
    }

    if (finalResult === null) {
      throw new ADBInterfaceException('ADB returned null value')
    }
    return finalResult
  }
  public async ResetPorts(port: string): Promise<string> {
    let finalResult = null
    try {
      const consoleReturn = await this.resolverInstance.sendADBCommand(
        adbCommands.RESET_PORTS(port)
      )
      const output = consoleReturn.toString()
      if (isValidReturn(output, adbReturns.RESTARTING_PORT())) {
        finalResult = adbMessages.DEVICES_IN_TCP_MODE()
      }
    } catch (e) {
      if (e.message.includes(adbReturns.NO_DEVICES_FOUND())) {
        finalResult = adbMessages.NO_DEVICES_FOUND()
      } else {
        throw new ADBInterfaceException(e.message)
      }
    }
    if (finalResult == null) {
      throw new ADBInterfaceException('Error while reset TCP IP Ports')
    }
    return finalResult
  }

  public async DisconnectFromAllDevices(): Promise<string> {
    let finalResult = null
    try {
      const result = await this.resolverInstance.sendADBCommand(
        adbCommands.ADB_DISCONNECT_ALL()
      )
      const output = result.toString()
      if (isValidReturn(output, adbReturns.DISCONNECTED_EVERTHING())) {
        finalResult = 'Disconnected from all devices'
      }
    } catch (e) {
      throw new ADBInterfaceError(e.toString())
    }
    if (finalResult == null) {
      throw new ADBInterfaceException('Error while reset TCPIP Ports')
    }
    return finalResult
  }

  public async FindConnectedDevices(): Promise<Array<string>> {
    const devicesArray = []
    try {
      const result = await this.resolverInstance.sendADBCommand(
        adbCommands.LIST_ADB_DEVICES()
      )
      const output = result.toString()
      if (isValidReturn(output, adbReturns.LISTING_DEVICES())) {
        // split all returned ips separated by line breaks
        let foundedIPs = output.split(/[\r]|[\n]/gim)
        // filter only who is ip address.
        foundedIPs = foundedIPs.filter(ip => IPHelpers.isAnIPAddress(ip))
        // found devices on lan
        const foundedOnLan = await this.netHelpers.FindLanDevices()
        foundedIPs = foundedIPs.concat(...foundedOnLan)

        // try to get device name trought adb
        foundedIPs = foundedIPs.map((ipAddress: string): string => {
          const extractedIP = IPHelpers.extractIPRegex(ipAddress)
          return `${extractedIP} | NO DEVICE INFO`
        })

        return foundedIPs
      }
    } catch (e) {
      throw new ADBInterfaceException(e.message)
    }
    if (!devicesArray || (devicesArray && devicesArray.length <= 0)) {
      throw new ADBInterfaceException('List from devices are empty.')
    }
    return devicesArray
  }

  public async KillADBServer(): Promise<string> {
    let returned = null
    try {
      const result = await this.resolverInstance.sendADBCommand(
        adbCommands.ADB_KILL_SERVER()
      )
      if (result.toString() == adbReturns.ADB_KILLED_SUCCESS_RETURN()) {
        returned = 'ADB Server killed'
      } else {
        throw new ADBInterfaceError('ADB Server not killed')
      }
    } catch (e) {
      if (e instanceof ADBInterfaceError) {
        throw e
      } else {
        throw new ADBInterfaceException(e.message)
      }
    }
    if (returned == null) {
      throw new ADBInterfaceError('Fail during ADB Kill')
    }
    return returned
  }

  public async InstallApkOnDevice(apkFilePath): Promise<string> {
    let resultString = null
    try {
      const adbReturn = await this.resolverInstance.sendADBCommand(
        adbCommands.ADB_INSTALL_APK(apkFilePath)
      )
      resultString = adbReturn.toLocaleString()
      if (isValidReturn(resultString, adbReturns.APK_INSTALLED_SUCCESS())) {
        resultString = `Installed "${apkFilePath}" with success`
      } else if (isValidReturn(resultString, 'no devices found')) {
        throw new ADBInterfaceException('No connected devices found')
      } else {
        throw new ADBInterfaceError(resultString)
      }
    } catch (e) {
      if (e instanceof ADBInterfaceError) {
        throw e
      } else {
        throw new ADBInterfaceException(e.message)
      }
    }
    if (resultString == null) {
      throw new ADBInterfaceError('Fail during ADB Kill')
    }
    return resultString
  }
}

export class ADBInterfaceError extends Error {
  constructor(message: string = adbMessages.ADB_INTERFACE_ERROR_DEFAULT()) {
    super(message)
    this.name = 'ADBInterfaceError'
  }
}
export class ADBInterfaceException extends Error {
  constructor(message: string = adbMessages.ADB_INTERFACE_EXCEPTION_DEFAULT()) {
    super(message)
    this.name = 'ADBInterfaceException'
  }
}
