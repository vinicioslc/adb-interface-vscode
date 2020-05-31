import { IConsoleInterface } from '../console-interface/iconsole-interface'

export class ConsoleChannel {
  consoleInstance: IConsoleInterface
  constructor(CiInstance: IConsoleInterface) {
    this.consoleInstance = CiInstance
  }
  sendCommandSync(consoleCommand: string): Buffer {
    return this.consoleInstance.execConsoleSync(consoleCommand)
  }
}

export function consoleReturnAre(output: string, expected: string): boolean {
  return output.includes(expected)
}
