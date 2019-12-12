import { IConsoleInterface } from '../console-interface/iconsole-interface'

export class ConsoleChannel {
  consoleInterface: IConsoleInterface
  constructor(CiInstance: IConsoleInterface) {
    this.consoleInterface = CiInstance
  }
  sendCommandSync(consoleCommand: string): Buffer {
    return this.consoleInterface.execConsoleSync(consoleCommand)
  }
}
