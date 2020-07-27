import { IConsoleInterface } from '../../infraestructure/console/console-interface/iconsole-interface'
import adbCommands from './adb-commands'

export class DeviceHelpers {
  static getDeviceModel(
    ConsoleInstance: IConsoleInterface,
    deviceIP: string
  ): string {
    return ConsoleInstance.execConsoleSync(
      adbCommands.GET_DEVICE_MODEL(deviceIP)
    ).toString()
  }
}
