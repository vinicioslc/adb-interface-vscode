import { IConsoleInterface } from './../console/console-interface/iconsole-interface'
import * as helperFunctions from './adb-path'
import * as globalStateKeys from '../../config/global-state-keys'

export class ADBResolver {
  osType: string
  homeDir: string
  consoleInterface: IConsoleInterface

  private readonly validADBReturn = 'List of'
  private readonly adbTestCommand = 'adb devices'
  private readonly currentStorage: any

  constructor(
    homeDir: string,
    osType: string,
    consoleInterfaceInstance: IConsoleInterface,
    currentStorage: any
  ) {
    this.homeDir = homeDir
    this.osType = osType
    this.consoleInterface = consoleInterfaceInstance
    this.currentStorage = currentStorage
  }

  private async hasAndroidInEnv(): Promise<boolean> {
    try {
      const consoleString = await this.consoleInterface.execConsoleStringSync(
        this.adbTestCommand
      )
      return consoleString.includes(this.validADBReturn)
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
      const adbFolder = this.returnDefaultADBPath()
      const consoleString = await this.consoleInterface.execConsoleStringSync(
        this.adbTestCommand,
        {
          cwd: adbFolder
        }
      )
      return consoleString.includes(this.validADBReturn)
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

    const isEnv = await this.hasAndroidInEnv()
    if (isEnv) {
      return this.homeDir
    }
    const isOnDefaultFolder = await this.hasPlatformToolsDefaultFolder()
    if (isOnDefaultFolder) {
      return this.returnDefaultADBPath()
    }

    throw new ADBNotFoundError()
  }

  public async sendADBCommand(command: string): Promise<Buffer> {
    const adbPath = await this.getDefaultADBPath()
    console.log('Executing', command)
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
