import * as os from 'os'
import { ConsoleInterface } from '../console/console-interface'
import * as helperFunctions from './adb-path'
import { Memento } from 'vscode'
import * as globalStateKeys from '../../config/global-state-keys'

export class ADBResolver {
  osType: string
  homeDir: string
  consoleInterface: ConsoleInterface

  private readonly validADBReturn = 'List of devices'
  private readonly adbTestCommand = 'adb devices'
  private readonly currentStorage: any

  constructor(
    homeDir: string,
    osType: string,
    consoleInterfaceInstance: ConsoleInterface,
    currentStorage: any
  ) {
    this.homeDir = homeDir
    this.osType = osType
    this.consoleInterface = consoleInterfaceInstance
    this.currentStorage = currentStorage
  }

  private async hasAndroidInEnv(): Promise<boolean> {
    try {
      const consoleString = await this.consoleInterface.execConsoleSync(
        this.adbTestCommand
      )
      return consoleString.toString().includes(this.validADBReturn)
    } catch (e) {
      console.error('[LOG] Not founded in default env', e)
      return false
    }
  }
  private returnDefaultADBPath(): string {
    const path = helperFunctions.getAndroidStudioPath({
      osType: this.osType,
      homeDir: this.homeDir
    })
    return path
  }

  private async hasPlatformToolsDefaultFolder(): Promise<boolean> {
    try {
      let adbFolder = this.returnDefaultADBPath()
      const consoleString = await this.consoleInterface.execConsoleSync(
        this.adbTestCommand,
        {
          cwd: adbFolder
        }
      )
      return consoleString.toString().includes(this.validADBReturn)
    } catch (e) {
      console.error('[LOG] Not founded in common folder', e)
      return false
    }
  }

  public async getDefaultADBPath(): Promise<string> {
    const customADBPath = await this.currentStorage.get(
      globalStateKeys.customADBPathKey()
    )

    if (customADBPath && typeof customADBPath == 'string') {
      return customADBPath
    }

    let isEnv = await this.hasAndroidInEnv()
    if (isEnv) {
      return this.homeDir
    }
    let isFolder = await this.hasPlatformToolsDefaultFolder()
    if (isFolder) {
      return this.returnDefaultADBPath()
    }

    throw new ADBNotFoundError()
  }

  public async sendADBCommand(command: string): Promise<Buffer> {
    const adbPath = await this.getDefaultADBPath()
    console.log("Executing", command);
    return this.consoleInterface.execConsoleSync(command, {
      cwd: adbPath
    })
  }
}

export class ADBNotFoundError extends Error {
  constructor(message = 'ADB not founded in this machine') {
    super(message)
    this.message = message
  }
}
