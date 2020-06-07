import * as path from 'path'
import * as os from 'os'
import { ConsoleInterface } from '../console/console-interface'
import * as helperFunctions from './helper-functions'

export class ADBResolver {
  homeDir: string
  osType: string
  consoleInterface: ConsoleInterface

  private readonly successADBReturn = 'Android Debug Bridge'

  constructor(
    homeDir: string,
    osType: string,
    consoleInterfaceInstance: ConsoleInterface
  ) {
    this.homeDir = homeDir
    this.osType = osType
    this.consoleInterface = consoleInterfaceInstance
  }

  private async hasAndroidInEnv(): Promise<boolean> {
    const result = await this.consoleInterface.execConsoleSync('adb')
    return result.toLocaleString().includes(this.successADBReturn)
  }
  private returnDefaultADBPath(): string {
    return helperFunctions.getAndroidStudioPath({
      osType: this.osType,
      homeDir: this.homeDir
    })
  }

  private async hasPlatformToolsDefaultFolder(): Promise<boolean> {
    const result = await this.consoleInterface.execConsoleSync('adb', {
      cwd: this.returnDefaultADBPath()
    })
    return result.toLocaleString().includes(this.successADBReturn)
  }

  public async getDefaultADBPath() {
    if (await this.hasAndroidInEnv()) {
      return os.homedir()
    } else if (await this.hasPlatformToolsDefaultFolder()) {
      return this.returnDefaultADBPath()
    }
    throw new ADBNotFoundError()
  }

  public async sendADBCommand(command: string): Promise<Buffer> {
    return this.consoleInterface.execConsoleSync(command, {
      cwd: await this.getDefaultADBPath()
    })
  }
}

export class ADBNotFoundError extends Error {
  constructor(message = 'ADB not founded in this machine') {
    super(message)
    this.message = message
  }
}
