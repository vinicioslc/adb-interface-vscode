import * as os from 'os'
import adbCommands from './adb-commands'
import {
  ConsoleInterfaceChannel,
  isValidReturn
} from '../console/console-interface-channel'
import adbReturns from './adb-returns'
import adbMessages from './adb-messages'
import { IPHelpers } from './ip-helpers'
import { Memento } from 'vscode'
import { INetHelpers } from '../net-helpers/net-helpers-interface'
import { ADBResolver } from '../adb-resolver'
import { IConsoleInterface } from '../console/console-interface/iconsole-interface'

export class ADBConnection extends ConsoleInterfaceChannel {
  private resolverInstance: ADBResolver
  private netHelpers: INetHelpers

  constructor(
    ciInstance: IConsoleInterface,
    currentStorage: Memento,
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
  public async ConnectToDevice(ipAddress: string): Promise<string> {
    let finalResult = null

    const deviceIP = IPHelpers.extractIPRegex(ipAddress)
    const resultString = (
      await this.resolverInstance.sendADBCommand(
        adbCommands.CONNECT_IP_AND_PORT(deviceIP)
      )
    ).toString()

    if (isValidReturn(resultString, adbReturns.CONNECTED_TO())) {
      finalResult = `Connected to: ${ipAddress}:5555`
    }
    if (isValidReturn(resultString, adbReturns.ALLREADY_CONNECTED_TO())) {
      throw new ADBInterfaceException(
        `Allready connected to: ${ipAddress}:5555`
      )
    }
    if (isValidReturn(resultString, adbReturns.CONNECTION_REFUSED(deviceIP))) {
      throw new ADBInterfaceException(
        'Connection refused:\n Target machine actively refused connection.'
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
  public async ResetPorts(): Promise<string> {
    let finalResult = null
    try {
      const consoleReturn = await this.resolverInstance.sendADBCommand(
        adbCommands.RESET_PORTS()
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
    let devicesArray = []
    try {
      const result = await this.resolverInstance.sendADBCommand(
        adbCommands.LIST_ADB_DEVICES()
      )
      const output = result.toString()
      if (isValidReturn(output, adbReturns.LISTING_DEVICES())) {
        // split all returned ips separated by line breaks
        let ips = output.split(/[\r]|[\n]/gim)
        // filter only who is ip address.
        ips = ips.filter(ip => IPHelpers.isAnIPAddress(ip))
        // found devices on lan
        const foundedLanIps = await this.netHelpers.FindLanDevices()
        ips = ips.concat(...foundedLanIps)

        // try to get device name trought adb
        ips = ips.map((ipAddress: string): string => {
          let extractedIP = IPHelpers.extractIPRegex(ipAddress)
          return `${extractedIP} | NO DEVICE INFO`
        })

        return ips
      }
    } catch (e) {
      throw new ADBInterfaceException(e.message)
    }
    if (devicesArray.length <= 0) {
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
    let returned = null
    try {
      const result = await this.resolverInstance.sendADBCommand(
        adbCommands.ADB_INSTALL_APK(apkFilePath)
      )

      returned = 'Finished:' + result.toLocaleString()
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
