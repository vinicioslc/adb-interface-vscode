import { IConsoleInterface } from "../console-interface/iconsole-interface"
import adbCommands from "./adb-commands"

export class DeviceHelpers {
    static getDeviceManufacturer(
      ConsoleInstance: IConsoleInterface,
      ipAddress: string
    ): string {
      return ConsoleInstance.execConsoleSync(
        adbCommands.GET_DEVICE_MODEL(ipAddress)
      ).toString()
    }
  
    static getDeviceModel(
      ConsoleInstance: IConsoleInterface,
      deviceIP: string
    ): string {
      return ConsoleInstance.execConsoleSync(
        adbCommands.GET_DEVICE_MODEL(deviceIP)
      ).toString()
    }
  }
  